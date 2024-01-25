import express from 'express'
import multer from 'multer';
import http from 'http'
import axios from 'axios'
import dotenv from 'dotenv'

import { PORT, MAX_SIZE_BYTES, MAX_SIZE_MB, temp_map, __dirname, public_dir } from './config.js';
import {Client, GatewayIntentBits} from 'discord.js'

import fs from 'fs'
import path from 'path';

dotenv.config();

const app = express();
app.use(express.static('public', {index: false, redirect: false}))
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent], restRequestTimeout: 600000 });

const mem_storage = multer.memoryStorage()
const upload = multer({ storage: mem_storage })

app.get('/', async (req, res) => {
    res.sendFile(path.join(public_dir, 'index.html'))
})

app.get('/files', async (req, res) => {
    res.sendFile(path.join(public_dir, 'index.html'))
})

app.get('/get-files', (req, res) => {
    const files = Object.keys(temp_map).map(key => {
        return {name: key, type: temp_map[key].type}
    })

    res.json({files: files})
})


app.route('/get-file/:name')
.get(async (req, res) => {
    const fileName = req.params.name;
    const file = temp_map[fileName]
    if (!file) {
        return res.json({success: false})
    }

    let data = null;
    let chunksCount = file.linksCount;
    if (!chunksCount) {
        chunksCount = 0;
        data = await oneChunk(file.id);
    } else {
        data = await combineChunks(file.id, chunksCount)
    }

    if (data) {
        const filePath = `./files/${fileName}`
        await OpenAndWrite(filePath, data)
        return res.download(path.join(__dirname, filePath), async (error) => {
            if (error) {
                console.log(`Error while downloading file`)
                return res.status(500).send('Error while downloading file')
            }

            await DeleteFile(filePath)
            console.log('File downloaded successfully')
        })
    }

    return res.json({success: false})
})

app.route('/file-upload')
.post(upload.array('file', 5), async (req, res) => {
    try {
        const files = req.files;
        const ToStore = files.map((file) => {
            const data_base64 = file.buffer.toString("base64")
            return {
                name: file.originalname,
                type: file.mimetype,
                data: data_base64
            }
        })

        ToStore.forEach(async (file) => {
            if (temp_map[file.name]) {
                return;
            }

            const buffer = Buffer.from(file.data);
            const SIZE_IN_BYTES = buffer.length;
            const SIZE_IN_MB = SIZE_IN_BYTES / 1e+6
            const PassedSizeLimit = SIZE_IN_MB > MAX_SIZE_MB
            
            if (PassedSizeLimit) {
                const chunksCount = await makeChunks(file.data, SIZE_IN_BYTES);
                const files = [];
                for (let index = 0; index < chunksCount; index++) {
                    files.push(`./files/temp${index}.txt`)
                }

                await SendAttachmentChainLink(files, file.name, file.type, SIZE_IN_MB, chunksCount)
                await DeleteFiles(chunksCount)

                return;
            }

            let filePath = './files/temp.txt'
            await OpenAndWrite(filePath, file.data)
            await SendAttachment([filePath], file.type, file.name, SIZE_IN_MB)

            await DeleteFile(filePath)
        })

        res.status(200).json({success: true})
    } catch(error) {
        console.log(error);
        res.status(500).json({success: false})
    }
})

const OpenAndWrite = (filePath, data) => {
    return new Promise((resolve, reject) => {
        fs.open(filePath, 'r', (error) => {
            if (error) {
                fs.writeFile(filePath, data, (error) => {
                    if (error) {
                        console.log(error)
                        reject(error)
                    }

                    resolve();
                })
            }
        })
    })
}

const DeleteFiles = (chunksCount) => {
    return new Promise((resolve, reject) => {
        for (let index = 0; index < chunksCount; index++) {
            const chunkFilePath = `./files/temp${index}.txt`
            fs.unlink(chunkFilePath, (err) => {
                if (err) return reject(err);
            });    
        }

        resolve();
    })
}

const DeleteFile = (filePath) => {
    return new Promise((resolve, reject) => {
        fs.unlink(filePath, (err) => {
            if (err) return reject(err);
        });    

        resolve();
    })
}


const makeChunks = async (base64_data, fileSize) => {
    const chunksCount = Math.ceil(fileSize / MAX_SIZE_BYTES);

    for (let index = 0; index < chunksCount; index++) {
        const path = `./files/temp${index}.txt`
        const start = index * MAX_SIZE_BYTES;
        const end = Math.min((index + 1) * MAX_SIZE_BYTES, fileSize);

        const chunk = base64_data.substring(start, end);
        await OpenAndWrite(path, chunk)
    }

    return chunksCount;
}

const oneChunk = async (messageID) => {
    console.log('one chunk')
    const channel = await client.channels.fetch('1197277130686472333');
    const message = await channel.messages.fetch(messageID)
    if (!message) {
        throw new Error("Couldn't find the original message")
    }

    const originalUrl = message.attachments.map(att => att.url)[0]

    const response = await axios.get(originalUrl);
    
    const content = response.data;

    const data = atob(content)
    return data;

}


const combineChunks = async (messageID, linksCount) => {
    console.log('several chunk')

    try {
        const channel = await client.channels.fetch('1197277130686472333');
        const messageThread = await channel.messages.fetch({ after: messageID, limit: linksCount - 1 });
        if (!messageThread) {
            throw new Error("Couldn't find message thread")
        }
    
        const filesUrlStack = []
        messageThread.map(msg => {
            if (msg.attachments.size > 0) {
                msg.attachments.forEach(attachment => {
                    filesUrlStack.push(attachment.url);
                });
            }
        })
    
        const message = await channel.messages.fetch(messageID)
        if (!message) {
            throw new Error("Couldn't find the original message")
        }
    
        const originalUrl = message.attachments.map(att => att.url)[0]
        filesUrlStack.push(originalUrl)
        filesUrlStack.reverse()
    
        const responses = await Promise.all(filesUrlStack.map(url => axios.get(url)));
    
        const contents = responses.map(response => response.data);
    
        const combinedContent = contents.join('');
    
        const data = atob(combinedContent)
        return data;

    } catch (error) {
        console.log(error.message)
        return null;
    }
}

const SendAttachment = async (files, type, originalname, size) => {
    const channel = await client.channels.fetch('1197277130686472333');
    const message = await channel.send({
        content: "DicordCloud",
        files: files
    });
    
    temp_map[originalname] = {id: message.id, type: type, size: size};
}

const SendAttachmentChainLink = async (files, originalname, type, size, linksCount) => {
    const channel = await client.channels.fetch('1197277130686472333');

    const message = await channel.send({
        content: "DicordCloud",
        files: [files[0]],
    });

    for (let index = 1; index < linksCount; index++) {
        await message.reply({files: [files[index]]})
    }
    
    temp_map[originalname] = {id: message.id, type: type, size: size, linksCount: linksCount};
}

const download = (url, filename) => {
    const dest = `./downloaded/${filename}`
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        const request = http.get(url, (response) => {
            response.pipe(file);
    
            file.on('finish', () => {
                file.close();
                resolve('Download Completed')
            }).on('error', (error) => {
                fs.unlink(dest);
                reject(error.message)
            });
        });    
    })
}

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});
  
client.login(process.env.TOKEN)
app.listen(PORT, () => {
    console.log(`Server is listening to port: ${PORT}`
)});
import express from 'express'
import multer from 'multer'
import path from 'path'
import { v4 } from 'uuid'

import { SendAttachment, SendAttachmentChainLink } from '../Helper/SendAttachment.js'
import { DeleteFile, DeleteFiles } from '../Helper/DeleteFiles.js'
import { MAX_SIZE_MB, temp_map, __dirname } from '../../config.js';
import { DeleteAttachment, DeleteAttachments } from '../Helper/DeleteAttachments.js'

import CreateChunks from '../Helper/CreateChunks.js'
import OpenAndWritePromise from '../Helper/OpenAndWritePromise.js'
import CombineChunk from '../Helper/CombineChunk.js'
import CombineChunks from '../Helper/CombineChunks.js'


const Api = express.Router()

const mem_storage = multer.memoryStorage()
const upload = multer({ storage: mem_storage, encoding: 'utf-8' })

Api.get('/files', (req, res) => {
    const query = req.query.count
    if (query) {
        return res.json({count: Object.keys(temp_map).length})
    }

    const files = Object.keys(temp_map).map(key => {
        return {name: key, type: temp_map[key].type}
    })

    res.json({files: files})
})


Api.route('/file/:name')
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
        data = await CombineChunk(file.id);
    } else {
        data = await CombineChunks(file.id, chunksCount)
    }

    if (data) {
        const filePath = path.join(__dirname, `/files/${fileName}`)
        await OpenAndWritePromise(filePath, data)
        return res.download(filePath, async (error) => {
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
.delete(async (req, res) => {
    const fileName = req.params.name;
    const file = temp_map[fileName]
    if (!file) {
        return res.json({success: false})
    }

    try {
        const PromiseResult = file.hasOwnProperty("linksCount") ? await DeleteAttachments(file.id, file.linksCount) : await DeleteAttachment(file.id);
        delete temp_map[fileName]
        console.log(`[${fileName}] has been successfully deleted`)
        return res.json({success: true})

    } catch (error) {
        console.log(error.message)
        return res.json({success: false})
    }
})


Api.route('/file-upload')
.post(upload.array('file', 5), async (req, res) => {
    try {
        const files = req.files;
        const ToStore = files.map((file) => {
            const buffer = file.buffer
            return {
                name: file.originalname,
                type: file.mimetype,
                data: buffer
            }
        })

        await Promise.all(ToStore.map(async (file) => {
            if (temp_map[file.name]) {
                return;
            }

            const buffer = Buffer.from(file.data);

            const SIZE_IN_BYTES = buffer.length;
            const SIZE_IN_MB = SIZE_IN_BYTES / 1e+6
            const PassedSizeLimit = SIZE_IN_MB > MAX_SIZE_MB
            
            if (PassedSizeLimit) {
                const files_path = await CreateChunks(file.data, SIZE_IN_BYTES);
                const chunksCount = files_path.length

                await SendAttachmentChainLink(files_path, file.name, file.type, SIZE_IN_MB, chunksCount)
                await DeleteFiles(files_path)

                return;
            }

            const file_path = path.join(__dirname, `/files/${v4()}.txt`)
            await OpenAndWritePromise(file_path, file.data)
            await SendAttachment([file_path], file.type, file.name, SIZE_IN_MB)

            await DeleteFile(file_path)
        }))

        res.status(200).json({success: true})
    } catch(error) {
        console.log(error.message);
        res.json({success: false}).status(500)
    }
})


export default Api
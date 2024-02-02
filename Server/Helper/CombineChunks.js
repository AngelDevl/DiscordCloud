import { client, channelID } from '../../config.js'
import axios from 'axios';

const CombineChunks = async (messageID, linksCount) => {
    try {
        const channel = await client.channels.fetch(channelID);
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
    
        const responses = await Promise.all(filesUrlStack.map(url => axios.get(url, { responseType: 'arraybuffer' })));
        
        const buffers = responses.map(response => Buffer.from(response.data));
        const combinedBuffer = Buffer.concat(buffers);

        return combinedBuffer;

    } catch (error) {
        console.log(error.message)
        return null;
    }
}


export default CombineChunks
import { client, channelID } from '../../config.js'
import axios from 'axios';

const CombineChunk = async (messageID) => {
    const channel = await client.channels.fetch(channelID);
    const message = await channel.messages.fetch(messageID)
    if (!message) {
        throw new Error("Couldn't find the original message")
    }

    const originalUrl = message.attachments.map(att => att.url)[0]

    const response = await axios.get(originalUrl);
    
    const content = response.data;

    return content;
}

export default CombineChunk
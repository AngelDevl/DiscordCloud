import { client, channelID } from "../../config.js";


export const DeleteAttachments = async (messageID, linksCount) => {
    try {
        const channel = await client.channels.fetch(channelID);
        const originalMessage = await channel.messages.fetch(messageID);
        const messageThread = await channel.messages.fetch({ after: messageID, limit: linksCount - 1 });
        if (!messageThread || messageThread.size === 0) {
            throw new Error("Couldn't find message thread")
        }

        await originalMessage.delete()

        const deletionPromises = Array.from(messageThread.values()).map(message => message.delete())
        const responses = await Promise.allSettled(deletionPromises)

        responses.forEach(response => {
            if (response.status == 'rejected') {
                throw new Error(response.reason);
            }
        })
        
    } catch (error) {
        console.error('Error:', error.message);
        throw error
    }
}


export const DeleteAttachment = async (messageID) => {
    try {
        const channel = await client.channels.fetch(channelID);
        const originalMessage = await channel.messages.fetch(messageID);
        if (originalMessage)
            await originalMessage.delete()

    } catch (error) {
        console.error('Error:', error.message);
        throw error
    }
}
import { client, temp_map, channelID } from '../../config.js'


export const SendAttachment = async (files, type, originalname, size) => {
    const channel = await client.channels.fetch(channelID);
    const message = await channel.send({
        content: "DicordCloud",
        files: files
    });
    
    temp_map[originalname] = {id: message.id, type: type, size: size};
}

export const SendAttachmentChainLink = async (files, originalname, type, size, linksCount) => {
    const channel = await client.channels.fetch(channelID);

    const message = await channel.send({
        content: "DicordCloud",
        files: [files[0]],
    });

    await ReplyAll(files, message, linksCount)
    temp_map[originalname] = {id: message.id, type: type, size: size, linksCount: linksCount};
}

const ReplyAll = async (files, message, linksCount) => {
    for (let index = 1; index < linksCount; index++) {
        try {
            await message.reply({files: [files[index]]})
        } catch (error) {
            console.log(error.message)
        }
    }
}
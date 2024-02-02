import { MAX_SIZE_BYTES, __dirname } from "../../config.js";
import OpenAndWritePromise from "./OpenAndWritePromise.js";
import path from 'path'

const CreateChunks = async (data, fileSize) => {
    const files_path = []
    const chunksCount = Math.ceil(fileSize / MAX_SIZE_BYTES);
    for (let index = 0; index < chunksCount; index++) {
        const chunkPath = path.join(__dirname, `/files/${index}.txt`)
        files_path.push(chunkPath)

        const start = index * MAX_SIZE_BYTES;
        const end = Math.min((index + 1) * MAX_SIZE_BYTES, fileSize);

        const chunk = data.slice(start, end);

        await OpenAndWritePromise(chunkPath, chunk)
    }

    return files_path;
}

export default CreateChunks
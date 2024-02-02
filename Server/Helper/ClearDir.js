import fs from 'fs'
import path from 'path';

const ClearDir = async (dirPath) => {
    try {
        const files = await new Promise((resolve, reject) => {
            fs.readdir(dirPath, (error, filenames) => {
                error != null ? reject(err) : resolve(filenames)
            })
        });

        if (files && files.length != 0) {
            const deleteFilePromises = files.map(file =>
                fs.unlink(path.join(dirPath, file), (error) => {
                    if (error)
                        console.log(error.message)
                }),
            );

            await Promise.all(deleteFilePromises);
        }
    } catch (err) {
        console.log(err);
    }
}


export default ClearDir
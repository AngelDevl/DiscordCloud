import fs from 'fs'

const OpenAndWritePromise = (writePath, data) => {
    return new Promise((resolve, reject) => {        
        fs.open(writePath, 'r', (error) => {
            if (error) {
                fs.writeFile(writePath, data, (error) => {
                    if (error) {
                        reject(error.message)
                    }

                    resolve();
                })
            }
        })
    })
}

export default OpenAndWritePromise
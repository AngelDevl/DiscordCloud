import fs from 'fs'
import { __dirname } from '../../config.js'

export const DeleteFiles = (files_path) => {
    return new Promise((resolve, reject) => {
        for (let index = 0; index < files_path.length; index++) {
            fs.unlink(files_path[index], (err) => {
                if (err) return reject(err.message);
            });    
        }

        resolve();
    })
}

export const DeleteFile = (filePath) => {
    return new Promise((resolve, reject) => {
        fs.unlink(filePath, (err) => {
            if (err) return reject(err);
        });    

        resolve();
    })
}
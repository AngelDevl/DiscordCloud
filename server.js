import express from 'express'
import dotenv from 'dotenv'
import path from 'path';
import Api from './Server/API/api.js';
import ClearDir from './Server/Helper/ClearDir.js';
import { client, PORT, __dirname } from './config.js';

dotenv.config();
const app = express();

app.use('/public', express.static('public', {index: false, redirect: false}))
app.use(express.json())

app.get('/', async (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))
})

app.get('/files', async (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))
})

app.use('/api', Api);
  
app.get('*', (req, res) => {
    res.send("Cannot find page with that url... code 404").status(404)
})

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

app.listen(PORT, async () => {
    console.log(`Server is listening to port: ${PORT}`)
    await client.login(process.env.TOKEN)
    await ClearDir('./files');
});
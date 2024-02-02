# Discord Cloud using Discord infinite cloud storage
-------------------------------------------------------------------------------
# Express, React, Discord.js
## How Upload, Download, and Deletion works?

### Upload:
1. Uploading the files into the server
2. Receving the files in the server via multer
3. Checking the size of the file

  File is bigger than the max size:

    1. Split the file into chunks (chunk size = max size (Max size defined in config.js))
    2. Write each file bytes into a txt file
    3. Send each file via Discord bot
    4. Store the following object: filename: {FirstMessageID, ChunkCount} in DB or temporery server object

  File is less than the max size:

    2. Write file bytes into a txt file
    3. Send the file via Discord bot
    4. Store the following object: filename: {FirstMessageID, ChunkCount} in DB or temporery server object

4. Your file is now uploaded and stored.

### Download:
1. Receive the object {FirstMessageID, ChunkCount} by providing the filename
2. Receive the MessageObject and the message thread (all the messages after the first one all the way to ChunkCount) by FirstMessageID & ChunkCount
3. Requesting all the messages (message thread and first message)
4. Combining all the txt files contents
5. Changing the file name into the original name
6. Sending the file to the client using res.download()

### Deletion:
1. Receive the object {FirstMessageID, ChunkCount} by providing the filename
2. Requesting the first message and the message thread
3. Delete all the messages from the original message all the way to chunk count

-------------------------------------------------------------------------------
## To use this project:
1. Create a discord server
2. Create a discord bot
3. Put the channel ID in config.js
4. Create .env file and put the token as: TOKEN=YOUR_BOT_TOKEN

*Credit to DevDetour who I had this idea from

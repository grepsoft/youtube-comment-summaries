require('dotenv').config()
const express = require('express');
const app = express();
const { google } = require('googleapis');
const util = require('./util');
const sendRequest = require('./ai-service');
const port = 3000;

// CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET')
    next()
})

app.get('/', (req, res) => {
    res.json('ok')
})

app.get('/analyze/:videoid', async (req, res) => {
    const videoId = req.params.videoid;

    try {

        const youtube = google.youtube('v3')
        const response = await youtube.commentThreads.list({
            part: 'snippet',
            videoId: videoId,
            maxResults: 5,
            order: 'relevance',
            auth: process.env.YOUTUBE_API_KEY
        })

        const topLevelComments = response.data.items
        if (!topLevelComments || topLevelComments.length === 0) {
            return res.status(200).send("No comments")
        }

        const comments = topLevelComments.map(item => ({
            text: item.snippet.topLevelComment.snippet.textOriginal,
            likeCount: item.snippet.topLevelComment.snippet.likeCount
        }))

        const commentsWithoutTimestamps = util.filterTimestamps(comments)
        const commentsText = commentsWithoutTimestamps.map((c,i) => `${i+1}. ${c.text}`)

        const aiResp = await sendRequest(commentsText.join())
        console.log(aiResp)
        res.send(aiResp)
    } catch(error) {
        console.log(error)
        res.status(500).json({message: "Failed to process"})
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
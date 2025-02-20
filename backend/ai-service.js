const OpenAI = require('openai')

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})


const sendRequest = async (comments) => {
    const prompt = `You are given a numbered list of youtube comments. Your job is to analyze these comments and give me an overall sentiment analysis. Ignore comments that talk about timestamps or promotions and analyze the rest of the comments. You don't need to tell me that you ignored comments. You also do not need to mention specific comment in your response. Provide a response no more than 400 characters.`;

    try {
        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {role: 'system', content: prompt}, {
                role: 'user', content: comments}]
        })

        if (completion.choices[0].finish_reason === 'stop') {
            const { message } = completion.choices[0]
            return message.content
        } else {
            return {message: "failed to process"}
        }

    } catch (error) {
        throw error
    }
}

module.exports = sendRequest
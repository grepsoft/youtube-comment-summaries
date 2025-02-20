const util = {
    filterTimestamps: (comments) => {
        return comments.filter(comment => {
            const timestampRegex =  /\d{2}:\d{2}:\d{2}/; // Matches HH:MM:SS
            return !timestampRegex.test(comment.text)
        })
    }
}

module.exports = util
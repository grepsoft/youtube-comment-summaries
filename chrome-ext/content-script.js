const apiUrl = 'http://localhost:3000/analyze'

function getVideoIdFromUrl(url) {
    const urlParams = new URLSearchParams(new URL(url).search)
    return urlParams.get('v')
}

async function sendRequest(videoId) {
    const url = `${apiUrl}/${videoId}`

    try {
        const result = await fetch(url, {
            method: 'GET'
        })

        const response = await result.text()
        return response
    } catch(error) {
        console.log(error)
        return error
    }
}

async function analyzeComments() {

    const commentsHeader = document.querySelector('ytd-comments-header-renderer')
    let newDiv = null
    if (commentsHeader) {

        const existingDiv = commentsHeader.nextElementSibling

        if (existingDiv && existingDiv.classList.contains('inserted-div')) {
            newDiv = existingDiv
        } else {
            newDiv = document.createElement('div')
            newDiv.classList.add('inserted-div')
            commentsHeader.insertAdjacentElement('afterend', newDiv)
        }
        newDiv.classList.add('pulsing-background')
        const currentUrl = window.location.href
        const videoId = getVideoIdFromUrl(currentUrl)

        if (videoId) {
            newDiv.innerHTML = `<p>Processing...</p>`
            const response = await sendRequest(videoId)
            newDiv.innerHTML = `<p>${response}</p>`
        } else {
            newDiv.innerHTML = '<p>Failed to find video</p>'
        }

        newDiv.classList.remove('pulsing-background')

    } else {
        console.error("faild to find comments section")
    }
}

chrome.runtime.onMessage.addListener(
    async (request, sender, sendResponse) => {
        analyzeComments()
        sendResponse({message: "All good!"})
    }
)
window.addEventListener('DOMContentLoaded', function () {

    const btn_analyze = document.getElementById('analyze')

    appendToLog("DOMContentLoaded")

    btn_analyze.addEventListener('click', async () => {
        const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true })
        const response = await chrome.tabs.sendMessage(tab.id, { message: "hello" })
        appendToLog(response.message)
    });
})

function appendToLog(logline) {
    document.getElementById('log')
        .appendChild(document.createElement('div')).innerText = '> ' + logline;
}
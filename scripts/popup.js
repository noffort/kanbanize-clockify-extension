function getTaskFromTabs(tabs) {
    let url = tabs[0].url;

    var start = url.indexOf('cards') + 6;
    var end = url.indexOf('/details');

    var task_id = url.substring(start, end)

    document.getElementById('task').value = task_id;
    document.getElementById('form-container').classList.remove('disabled');
}

function addInfo(msg) {
    var message_element = document.getElementsByClassName('message')[0];
    message_element.textContent = msg;
    message_element.classList.remove('disabled')
}


chrome.tabs.query({active: true, url : 'https://*.kanbanize.com/*/cards/*'}, tabs => {
    if (tabs.length > 0) { 
        console.info("ativa")
        getTaskFromTabs(tabs)
    } else {
        addInfo("Please keep the Kanbanize tab Actived with the task opened.")
    }
});



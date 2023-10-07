clockify_api.init();

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

function fillInputs(projects = false, tags = false) {
    if (projects) {
        var project_options = '<option value="" disabled selected>Select a Project</option>';
        for (i in projects) {   
            project_options += '<option value="' + projects[i].id + '">' + projects[i].name + '</option>';
        }
    
        document.getElementById('project').innerHTML = project_options;
    }

    if (tags) {
        var tags_options = '<option value="" disabled selected>Select a Tag</option>';
        for (i in tags) {   
            tags_options += '<option value="' + tags[i].id + '">' + tags[i].name + '</option>';
        }
    
        document.getElementById('tag').innerHTML = tags_options;
    }
}

function actionButton() {
    const project_value = document.getElementById('project').value;
    const tag_value = document.getElementById('tag').value;
    const task_id = document.getElementById('task').value;

    if (!project_value) {
        return false;
    }

    clockify_api.get_task(task_id, project_value).then((task) => {
        console.log(task);
        clockify_api.start_timer(task[0].id, project_value, tag_value);
    })
}

function showAuth() {
    let url = chrome.runtime.getURL("view/auth.html");
    chrome.tabs.create({ url });
}

chrome.tabs.query({active: true, url : 'https://*.kanbanize.com/*/cards/*'}, tabs => {
    if (tabs.length > 0) {
        fillInputs(); 
        getTaskFromTabs(tabs);
    } else {
        addInfo("Please keep the Kanbanize tab Actived with the task opened.")
    }
});

// chrome.storage.local.get(clockify_api.clockify_key).then((result) => {
//     if (chrome.runtime.lastError) {
//       console.error('Error getting from Chrome storage: ', chrome.runtime.lastError);
//     } else {
//         if (!result[clockify_api.clockify_key]) {
//             showAuth();
//         }
//     }
// });

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('form-container').addEventListener("submit", function(evt) {
        evt.preventDefault();
    }, true);

    document.getElementById('action-button').addEventListener("click", actionButton);
}, false);
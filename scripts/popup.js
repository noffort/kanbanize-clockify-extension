clockify_api.init();

let task_id = false;

function getTaskFromTabs(tabs) {
    let url = tabs[0].url;

    const start = url.indexOf('cards') + 6;
    const end = url.indexOf('/details');

    task_id = url.substring(start, end);
    setTimeout(initPopUp, 1000);
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

function initPopUp() {
    const workspaces = clockify_api.workspaces;
    
    let workspace_name = '';
    workspaces.forEach(w => {
        if (w.id == clockify_api.user.defaultWorkspace) {
            workspace_name = w.name;
        }
    });


    clockify_api.check_running_entry().then((result) => {
        if (!result) {
            document.getElementById('task').value = task_id;
            document.getElementById('form-container').classList.remove('disabled');
            document.querySelector('.loader').classList.add('disabled');
            return true;
        }

        document.getElementById('running-info').classList.remove('disabled');
        document.querySelector('.loader').classList.add('disabled');

        if (workspace_name != '') {
            document.querySelector('#workspace-info span').textContent = workspace_name;
            document.getElementById('workspace-info').classList.remove('disabled');
        }
        
        const time_entry = result[0];
        console.log(time_entry);
        document.getElementById('task-description').innerText = time_entry.description;
        
        const running_project = clockify_api.projects.filter((project) => project.id == time_entry.projectId)

        console.log(time_entry.taskId);
        clockify_api.get_task_by_id(time_entry.taskId, time_entry.projectId).then((task) => {
            document.getElementById('task-project').innerText = running_project[0].name + ':' + task.name;
        });
    });
}

function showAuth() {
    let url = chrome.runtime.getURL("view/auth.html");
    chrome.tabs.create({ url });
}

chrome.tabs.query({active: true, url : 'https://*.kanbanize.com/*/cards/*'}, tabs => {
    if (tabs.length > 0) {
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
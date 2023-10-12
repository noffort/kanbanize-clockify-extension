clockify_api.init();

let task_id = false;
let time_counter_start = '';

function getTaskFromTabs(tabs) {
    if (typeof tabs !== 'undefined' && tabs.length > 0) {
        let url = tabs[0].url;

        const start = url.indexOf('cards') + 6;
        const end = url.indexOf('/details');

        task_id = url.substring(start, end);
    }

    setTimeout(initPopUp, 600);
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
    let billable = document.getElementById('billable').getAttribute('billable');
    billable = billable == "on" ? true : false;

    if (!project_value || !tag_value) {
        return false;
    }

    clockify_api.get_task(task_id, project_value).then((task) => {
        document.getElementById('form-container').classList.add('disabled');
        document.querySelector('.loader').classList.remove('disabled');

        clockify_api.start_timer(task.id, project_value, tag_value, billable).then(() => {
            initPopUp();
        });
    })
}

function stopButton() {
    document.getElementById('running-info').classList.add('disabled');
    document.querySelector('.loader').classList.remove('disabled');

    clockify_api.stop_timer().then(() => {
        initPopUp();
    });
}

function initPopUp() {
    clockify_api.get_workspaces().then((workspaces) => {
        let workspace_name = '';
        workspaces.forEach(w => {
            if (w.id == clockify_api.user.defaultWorkspace) {
                workspace_name = w.name;
            }
        });

        if (workspace_name != '') {
            document.querySelector('#workspace-info span').textContent = workspace_name;
            document.getElementById('workspace-info').classList.remove('disabled');
        }
    
    
        clockify_api.check_running_entry().then((result) => {
            clockify_api.get_projects().then((projects) => {
                if (!result) {
                    if (task_id) {
                        clockify_api.get_tags().then((tags) => {
                            fillInputs(projects, tags);
                            document.getElementById('task').value = task_id;
                            document.getElementById('form-container').classList.remove('disabled');
                        });
                    } else {
                        addInfo("Please keep the Kanbanize tab Actived with the task opened.")
                    }

                    document.querySelector('.loader').classList.add('disabled');
                    return true;
                }
        
                const time_entry = result[0];
                time_counter_start = time_entry.timeInterval.start;
                setInterval(timeCounter, 1000);
        
                document.getElementById('running-info').classList.remove('disabled');
                document.querySelector('.loader').classList.add('disabled');
                
                document.getElementById('task-description').innerText = time_entry.description;
                
                const running_project = clockify_api.projects.filter((project) => project.id == time_entry.projectId)
        
                clockify_api.get_task_by_id(time_entry.taskId, time_entry.projectId).then((task) => {
                    document.getElementById('task-project').innerText = running_project[0].name + ':' + task.name;
                });
            });
        });
    });
}

function timeCounter() {
    startTime = new Date(time_counter_start).getTime();
    const now = new Date().getTime();
    const diff = now - startTime;

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    document.getElementById('counter').innerHTML = `${days}d ${hours % 24}h ${minutes % 60}m ${seconds % 60}s`;
}


function showAuth() {
    let url = chrome.runtime.getURL("view/auth.html");
    chrome.tabs.create({ url });
}

function billableAction() {
    const billableElement = document.getElementById('billable');

    if (billableElement.classList.contains('billable-on')) {
        billableElement.classList.remove('billable-on');
        billableElement.setAttribute("title", "Non-billable")
        billableElement.setAttribute("billable", "off")
    } else {
        billableElement.classList.add('billable-on');
        billableElement.setAttribute("billable", "on")
        billableElement.setAttribute("title", "Billable")
    }
}

chrome.tabs.query({active: true, url : 'https://*.kanbanize.com/*/cards/*'}, tabs => {
    getTaskFromTabs(tabs);
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
    document.getElementById('stop-button').addEventListener("click", stopButton);
    document.getElementById('billable').addEventListener("click", billableAction);
}, false);
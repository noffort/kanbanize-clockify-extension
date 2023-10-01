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
    
        console.log(project_options);
        document.getElementById('project').innerHTML = project_options;
    }

    if (tags) {
        var tags_options = '<option value="" disabled selected>Select a Tag</option>';
        for (i in tags) {   
            tags_options += '<option value="' + tags[i].id + '">' + tags[i].name + '</option>';
        }
    
        console.log(tags_options);
        document.getElementById('tag').innerHTML = tags_options;
    }
}

chrome.tabs.query({active: true, url : 'https://*.kanbanize.com/*/cards/*'}, tabs => {
    if (tabs.length > 0) {
        fillInputs(); 
        getTaskFromTabs(tabs);
    } else {
        addInfo("Please keep the Kanbanize tab Actived with the task opened.")
    }
});


var clockify_api = {
  clockify_key: 'noffort_Caeth3Haileeko1r',
  base_url: 'https://api.clockify.me/api/v1',
  headers: false,
  user: false,
  projects: false,
  tags: false,

  
  init: async function() {
    if (!clockify_api.headers) {
      chrome.storage.local.get(this.clockify_key).then((result) => {
        if (chrome.runtime.lastError) {
          console.error('Error getting from Chrome storage: ', chrome.runtime.lastError);
        } else {
          clockify_api.headers = {
            'X-Api-Key': atob(result[this.clockify_key]),
            'Content-Type': 'application/json',
          };
  
          clockify_api.auth()
            .then(() => {
              this.get_projects();
              this.get_tags();
            });
        }
      });
    }
  },

  auth: async function() {
    try {
      headers = this.headers;
      const response = await fetch(`${this.base_url}/user`, { headers });
  
      if (!response.ok) {
        throw new Error(`Authentication failed with status ${response.status}`);
      }
  
      const userData = await response.json();
      this.user = userData;
    } catch (error) {
      console.error('Authentication error:', error);
      throw error;
    }
  },

  get_projects: async function() {
    try {
      headers = this.headers;
      const response = await fetch(`${this.base_url}/workspaces/${this.user.defaultWorkspace}/projects?archived=false`, { headers });
  
      if (!response.ok) {
        throw new Error(`Authentication failed with status ${response.status}`);
      }
  
      const projectsData = await response.json();
      this.projects = [];
      for (p in projectsData) {
        this.projects.push({
          id: projectsData[p].id,
          name: projectsData[p].name
        })
      }

      fillInputs(this.projects, false);
    } catch (error) {
      console.error('Authentication error:', error);
      throw error;
    }
  },

  get_tags: async function() {
    try {
      headers = this.headers;
      const response = await fetch(`${this.base_url}/workspaces/${this.user.defaultWorkspace}/tags?archived=false`, { headers });
  
      if (!response.ok) {
        throw new Error(`Authentication failed with status ${response.status}`);
      }
  
      const tagsData = await response.json();
      this.tags = tagsData;
      fillInputs(false, this.tags);
    } catch (error) {
      console.error('Authentication error:', error);
      throw error;
    }
  },

  get_task: async function(task_id, project_id) {
    try {
      headers = this.headers;
      const response = await fetch(`${this.base_url}/workspaces/${this.user.defaultWorkspace}/projects/${project_id}/tasks?strict-name-search=true&name=${task_id}`, { headers });
      console.log(response);
      if (response.status == 404) {
        console.log('404');

        const taskData = {
          name: task_id
        }
  
        const response = await fetch(`${this.base_url}/workspaces/${this.user.defaultWorkspace}/projects/${project_id}/tasks`, {
          method: 'POST',
          headers,
          body: JSON.stringify(taskData),
        });
      }
  
      const task = await response.json();
      return task;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  },

  start_timer: async function(task_id, project_id) {
    try {
      const timeEntryData = {
        taskId: task_id,
        projectId: project_id,
        description: kb_noffort.get_task_title()
      }

      const response = await fetch(`${this.base_url}/workspaces/${this.user.defaultWorkspace}/time-entries`, {
        method: 'POST',
        headers,
        body: JSON.stringify(timeEntryData),
      });
  
      if (!response.ok) {
        throw new Error(`Timer start failed with status ${response.status}`);
      }
  
      const timerData = await response.json();
      return timerData;
    } catch (error) {
      console.error('Error starting timer:', error);
      throw error;
    }
  }
}
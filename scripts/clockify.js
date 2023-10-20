var clockify_api = {
  clockify_key: 'noffort_Caeth3Haileeko1r',
  base_url: 'https://api.clockify.me/api/v1',
  headers: false,
  user: false,
  projects: false,
  tags: false,
  workspaces: false,

  
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
  
          clockify_api.auth();
        }
      });
    }
  },

  auth: async function() {
    try {
      headers = this.headers;
      const user = await this.get_local_storage('noffort_user');
      if (user) {
        this.user = user;
        console.info('Getting user from cache.');
        return this.user;
      }

      const response = await fetch(`${this.base_url}/user`, { headers });
  
      if (!response.ok) {
        throw new Error(`Authentication failed with status ${response.status}`);
      }
  
      const userData = await response.json();
      this.user = userData;
      this.set_local_storage('noffort_user', this.user);
    } catch (error) {
      console.error('Authentication error:', error);
      throw error;
    }
  },

  get_projects: async function() {
    try {
      const noffort_projects = await this.get_local_storage('noffort_projects');
      if (noffort_projects) {
        this.projects = noffort_projects;
        console.info('Getting projects from cache.');
        return this.projects;
      }

      console.log('making projects rquest');

      headers = this.headers;
      const response = await fetch(`${this.base_url}/workspaces/${this.user.defaultWorkspace}/projects?archived=false&page-size=200`, { headers });
  
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

      this.set_local_storage('noffort_projects', this.projects);

      return this.projects;
    } catch (error) {
      console.error('Authentication error:', error);
      throw error;
    }
  },

  get_tags: async function() {
    try {
      const noffort_tags = await this.get_local_storage('noffort_tags');
      if (noffort_tags) {
        this.tags = noffort_tags;
        console.info('Getting tags from cache.');

        return this.tags;
      }

      headers = this.headers;
      const response = await fetch(`${this.base_url}/workspaces/${this.user.defaultWorkspace}/tags?archived=false`, { headers });
  
      if (!response.ok) {
        throw new Error(`Authentication failed with status ${response.status}`);
      }
  
      const tagsData = await response.json();
      this.tags = tagsData;
      this.set_local_storage('noffort_tags', this.tags);

      return this.tags;
    } catch (error) {
      console.error('Authentication error:', error);
      throw error;
    }
  },

  get_workspaces: async function() {
    try {
      const noffort_workspaces = await this.get_local_storage('noffort_workspaces');
      if (noffort_workspaces) {
        this.workspaces = noffort_workspaces;
        console.info('Getting workspaces from cache.');
        return this.workspaces;
      }

      headers = this.headers;
      const response = await fetch(`${this.base_url}/workspaces`, { headers });
  
      if (!response.ok) {
        throw new Error(`Authentication failed with status ${response.status}`);
      }
  
      this.workspaces = await response.json();

      this.set_local_storage('noffort_workspaces', this.workspaces);

      return this.workspaces;
    } catch (error) {
      console.error('Authentication error:', error);
      throw error;
    }
  },

  get_task: async function(task_id, project_id) {
    try {
      headers = this.headers;
      let response = await fetch(`${this.base_url}/workspaces/${this.user.defaultWorkspace}/projects/${project_id}/tasks?strict-name-search=true&name=${task_id}`, { headers });
      let task = await response.json();

      if (response.status != 404 && task.length > 0) {
        return task[0];
      }

      console.log('404');
      const taskData = {
        name: task_id
      }

      response = [];
      response = await fetch(`${this.base_url}/workspaces/${this.user.defaultWorkspace}/projects/${project_id}/tasks`, {
        method: 'POST',
        headers,
        body: JSON.stringify(taskData),
      });

      task = [];
      task = await response.json();
      return task;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  },

  get_task_by_id: async function(task_id, project_id) {
    try {
      headers = this.headers;
      let response = await fetch(`${this.base_url}/workspaces/${this.user.defaultWorkspace}/projects/${project_id}/tasks/${task_id}`, { headers });
      let task = await response.json();

      if (!response.ok) {
        throw new Error(`Authentication failed with status ${response.status}`);
      }

      return task;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  },

  start_timer: async function(task_id, project_id, tag_id, billable) {
    try {
      const card_title = await chrome.storage.local.get("noffort_card_title");
      tag_id = Array.isArray(tag_id) ? tag_id : [ tag_id ];
      console.log(card_title.noffort_card_title);

      const timeEntryData = {
        taskId: task_id,
        projectId: project_id,
        description: card_title.noffort_card_title,
        billable : billable,
        tagIds: tag_id
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
  },

  stop_timer: async function() {
    try {
      let bodyData = {};
      bodyData.end = new Date().toISOString();
      
      const response = await fetch(`${this.base_url}/workspaces/${this.user.defaultWorkspace}/user/${this.user.id}/time-entries`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(bodyData),
      });

      if (!response.ok) {
        throw new Error(`Error to stopping current time entry ${response.status}`);
      }

      const stopped_timyentry = await response.json();
      
      return stopped_timyentry;
    } catch (error) {
      console.error('Error stopping timer:', error);
      throw error;
    }
  },

  check_running_entry: async function() {
    const current_entry = await fetch(`${this.base_url}/workspaces/${this.user.defaultWorkspace}/user/${this.user.id}/time-entries?in-progress=true`, { headers });
    if (!current_entry.ok) {
      throw new Error(`Error to check_running_entry ${current_entry.status}`);
    }

    const entryData = await current_entry.json();
    if (entryData.length > 0 ) {
      return entryData;
    }

    return false;
  },

  get_local_storage: async function(key) {
    try {
      const value = await chrome.storage.local.get(key);

      if (!value[key]) {
        return false;
      }
    
      const created_at = value[key]['created_at'];
      const now = new Date().getTime();
      const diff = (now - created_at) / (1000 * 60 * 60);
  
      if (diff > 8) {
        this.set_local_storage(key, false);
        return false;
      }
      
      return value[key]['value'];
    } catch (error) {
      console.error('Error getting local storage:', error);
      throw error;
    }
  },

  set_local_storage: async function(key, value) {
    try {
      const now = new Date().getTime();
      const valueObj = {
        created_at: now,
        value: value
      }

      await chrome.storage.local.set({ [key]: valueObj });

      return true;
    } catch (error) {
      console.error('Error saving local storage:', error);
      throw error;
    }
  }
}
var kanbanize_api = {
  api_version: '/api/v2',
  api_key: false,
  base_url: false,
  headers: false,

  verify_api: async function(baseUrl, apiKey) {
    try {
      this.headers = {
        'Content-Type': 'application/json',
        'apikey': apiKey
      };
      
      console.log(this.headers);
      const headers = this.headers;
      const response = await fetch(`${baseUrl}${this.api_version}/me`, { headers });

      if (!response.ok) {
        throw new Error(`Authentication failed with status ${response.status}`);
      }

      kanbanize_api.set_local_storage("kb_base_url", baseUrl); 
      kanbanize_api.set_local_storage("kb_api_key", btoa(apiKey)); 

      return true;
    } catch (error) {
      console.error('Error to check API connection:', error);
      return false;
    }
  },

  save_time: async function(taskId, timeEntry) {
    try {
      api_key = await this.get_api_key();

      this.headers = {
        'Content-Type': 'application/json',
        'accept': 'application/json',
        'apikey': api_key
      };

      base_url = await this.get_base_url();
        
      const headers = this.headers;
      const today = await this.get_current_date();

      const started_date = new Date(timeEntry.timeInterval.start);
      const end_data = new Date(timeEntry.timeInterval.end);

      const time = (end_data - started_date) / 1000;

      const timeEntryData = {
        card_id: taskId,
        date: today,
        time: time,
        comment: "Added by noffort extension"
      }

      console.log(timeEntryData);

      response = [];
      response = await fetch(`${base_url}${this.api_version}/loggedTime`, {
        method: 'POST',
        headers,
        body: JSON.stringify(timeEntryData),
      });

      if (!response.ok) {
        throw new Error(`Authentication failed with status ${response.status}`);
      }

      responseData = await response.json();
      console.log(responseData);
      return responseData;
    } catch (error) {
      console.error('Error to check API connection:', error);
      return false;
    }
  },

  get_current_date: async function() {
    let today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();

    today = yyyy + '-' + mm + '-' + dd;
    return today;
  },

  get_base_url: async function() {
    if (this.base_url) {
      return this.base_url;
    }

    this.base_url = await this.get_local_storage("kb_base_url");

    return this.base_url;
  },

  get_api_key: async function() {
    if (this.api_key) {
      return this.api_key;
    }

    const api_key = await this.get_local_storage("kb_api_key");
    this.api_key = atob(api_key);

    return this.api_key;
  },

  get_local_storage: async function(key) {
    try {
        const value = await chrome.storage.local.get(key);

        if (!value[key]) {
          return false;
        }
  
        return value[key];
    } catch (error) {
        console.error('Error getting local storage:', error);
        throw error;
    }
  },

  set_local_storage: async function(key, value) {
    try {
        await chrome.storage.local.set({ [key]: value });

        return true;
    } catch (error) {
        console.error('Error saving local storage:', error);
        throw error;
    }
  }
}
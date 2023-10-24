var kanbanize_api = {
  api_version: '/api/v2',
  base_url: false,
  headers: false,

  verify_api: async function(baseUrl) {
    try {
      this.headers = {
        'Content-Type': 'application/json',
      };
      
      const headers = this.headers;
      const response = await fetch(`${this.base_url}${this.api_version}/me`, { headers });

      if (!response.ok) {
        throw new Error(`Authentication failed with status ${response.status}`);
      }

      return true;
    } catch (error) {
      console.error('Error to check API connection:', error);
      return false;
    }
  },

  save_time: async function(taskId, timeEntry) {
    try {
      this.headers = {
        'Content-Type': 'application/json',
        'accept': 'application/json',
        'apikey': 'APIKEY'
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
        comment: "Add by extension"
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
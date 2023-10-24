var kanbanize_api = {
  api_version: '/api/v2/',
  base_url: false,
  headers: false,

  verify_api: async function(baseUrl) {
    try {
      this.headers = {
        'Content-Type': 'application/json',
      };
  
      this.base_url = baseUrl;
      
      const headers = this.headers;
      const response = await fetch(`${this.base_url}/api/v2/me`, { headers });

      if (!response.ok) {
        throw new Error(`Authentication failed with status ${response.status}`);
      }

      return true;
    } catch (error) {
      console.error('Error to check API connection:', error);
      return false;
    }
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
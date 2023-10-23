var kanbanize_api = {
  clockify_key: 'noffort_oE3r7WvB9qtpLS7P',
  api_version: '/api/v2/',
  base_url: false,
  headers: false,

  verify_api: async function(baseUrl, key) {
    try {
      this.headers = {
        'X-Api-Key': key,
        'Content-Type': 'application/json',
      };
  
      this.base_url = baseUrl;
  
      const response = await fetch(`${this.base_url}/api/v2/me`, { headers });
  
      if (!response.ok) {
        throw new Error(`Authentication failed with status ${response.status}`);
      }

      return true;
    } catch (error) {
      console.error('Error to check API connection:', error);
      throw error;
    }
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
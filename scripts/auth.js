const baseUrl = 'https://api.clockify.me/api/v1';

function addErrorInfo() {
  apiKeyElement = document.getElementById("apiKey");
  apiKeyElement.classList.add('error-message');

  apiKeyKbElement = document.getElementById("apiKeyKb");
  apiKeyKbElement.classList.add('error-message');

  baseUrlElement = document.getElementById("baseUrlKb");
  baseUrlElement.classList.add('error-message');
  document.getElementById('bg').classList.add('disabled')

  setTimeout(function() {
    apiKeyElement.classList.remove('error-message');
    baseUrlElement.classList.remove('error-message');
    apiKeyKbElement.classList.remove('error-message');
  }, 5000)
}

async function auth() {
    try {
      const apiKey = document.getElementById("apiKey").value;
      const apiKeyKb = document.getElementById("apiKeyKb").value;
      const kbBaseUrl = document.getElementById("baseUrlKb").value;
      const termsOfUse = document.getElementById('terms-of-use').checked;

      if (!apiKey || !kbBaseUrl || !termsOfUse || !apiKeyKb) {
        return false;
      }

      document.getElementById('bg').classList.remove('disabled');
      
      const headers = {
        'X-Api-Key': apiKey,
        'Content-Type': 'application/json',
      };

      const response = await fetch(`${baseUrl}/user`, { headers });
  
      if (!response.ok) {
        document.getElementById('bg').classList.add('disabled');
        throw new Error(`Authentication failed with status ${response.status}`);
      }

      const checkKb = await kanbanize_api.verify_api(kbBaseUrl, apiKeyKb);
      if (!checkKb) {
        console.error('Kanbanize Credentials are invalid.')
        throw new Error(`Failed to connect in Kanbanize API. Please review the Base Url and API Key.`);
      }

      value = btoa(apiKey);
      chrome.storage.local.set({ 'noffort_Caeth3Haileeko1r': value }, function () {
        if (chrome.runtime.lastError) {
          document.getElementById('bg').classList.add('disabled');
          console.error('Error saving to Chrome storage: ', chrome.runtime.lastError);
        } else {
          chrome.tabs.query({url : 'https://*.kanbanize.com/*'}, tabs => {
            tabs.forEach((tab) => {
              chrome.tabs.reload(tab.id);
            })
          });
          
          chrome.tabs.create({ url: "http://eepurl.com/iBKrv-/" });

          chrome.tabs.getCurrent(function(tab) {
            chrome.tabs.remove(tab.id, function() { });
          });
        }
      });
    } catch (error) {
      alert('Authentication error:' + error);
      console.error('Authentication error:', error);
      addErrorInfo()
      throw error;
    }
}
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('apiKeyForm').addEventListener("submit", function(evt) {
    evt.preventDefault();
  }, true);

  document.getElementById("submit-button").addEventListener("click", auth);
}, false);



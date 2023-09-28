const baseUrl = 'https://api.clockify.me/api/v1';

function addErrorInfo() {
  apiKeyElement = document.getElementById("apiKey");
  apiKeyElement.classList.add('error-message')

  setTimeout(function() {
    apiKeyElement.classList.remove('error-message');
  }, 5000)
}

async function auth() {
    try {
      var apiKey = document.getElementById("apiKey").value

      const headers = {
        'X-Api-Key': apiKey,
        'Content-Type': 'application/json',
      };

      const response = await fetch(`${baseUrl}/user`, { headers });
  
      if (!response.ok) {
        throw new Error(`Authentication failed with status ${response.status}`);
      }
  
      value = btoa(apiKey);
      chrome.storage.sync.set({ ['noffort_Caeth3Haileeko1r']: value }, function () {
        if (chrome.runtime.lastError) {
          console.error('Error saving to Chrome storage: ', chrome.runtime.lastError);
        } else {
          chrome.tabs.getCurrent(function(tab) {
            chrome.tabs.remove(tab.id, function() { });
          });
        }
      });
    } catch (error) {
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



var kb_noffort = {
    get_task_details: async function() {
        setTimeout(function() {
            get_current_url = window.location.href;

            var start = get_current_url.indexOf('cards');
            var end = get_current_url.indexOf('/details');
    
            if (start == -1 || end == -1) {
                console.info("Active card not found...");
                return false;
            }
    
            var task_id = get_current_url.substring((start + 6), end);
    
            console.log(task_id);
        }, 300);
    }    
}

// chrome.storage.local.set({ 'noffort_Caeth3Haileeko1r': value }, function () {
//     if (chrome.runtime.lastError) {
//       console.error('Error saving to Chrome storage: ', chrome.runtime.lastError);
//     } else {
//       chrome.tabs.getCurrent(function(tab) {
//         chrome.tabs.remove(tab.id, function() { });
//       });
//     }
// });

window.addEventListener('load', function() {
    kb_noffort.get_task_details();

    const cards = document.querySelectorAll(".js-board-cards .js-task .js-card-title");
    cards.forEach(card => {
        console.log(card);
        card.addEventListener('click', kb_noffort.get_task_details);
    });
});
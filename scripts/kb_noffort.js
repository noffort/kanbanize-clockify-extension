var kb_noffort = {
    get_task_details: async function() {
        setTimeout(function() {
            get_current_url = window.location.href;

            const start = get_current_url.indexOf('cards');
            const end = get_current_url.indexOf('/details');
    
            if (start == -1 || end == -1) {
                console.info("Active card not found...");
                return false;
            }
            
            const card_title = document.querySelector('.modal-card-details .card-title').textContent;
            chrome.storage.local.set({ "noffort_card_title": card_title }, function () {
                console.log("Setting title");
                if (chrome.runtime.lastError) {
                  console.error('Error saving to Chrome storage: ', chrome.runtime.lastError);
                }
            });
        }, 1000);
    }    
}

window.addEventListener('load', function() {
    kb_noffort.get_task_details();

    const cards = document.querySelectorAll(".js-board-cards .js-task .js-card-title");
    cards.forEach(card => {
        card.addEventListener('click', kb_noffort.get_task_details);
    });
});
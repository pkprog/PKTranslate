function restoreOptions() {
    let storageItem = browser.storage.managed.get('yandexTranslateApiKey');
    storageItem.then((res) => {
        document.querySelector("#managed-colour").innerText = res.colour;
    });

    let gettingItem = browser.storage.sync.get('colour');
    gettingItem.then((res) => {
        document.querySelector("#yandexApiKey").value = res.colour || 'Firefox red';
    });

}

document.addEventListener('DOMContentLoaded', restoreOptions);
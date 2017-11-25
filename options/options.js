const PK_TRANSLATE_APP_NAME = "PKTranslate.options";
const PK_TRANSLATE_OPTIONS_KEY_YANDEX_API_KEY = "yandexTranslateApiKey";
const PK_TRANSLATE_OPTIONS_INPUT_ID_YANDEX_API_KEY = "#yandexApiKey";

function getFormattedDateTime(dateTime) {
    if (isFunction(dateTime.getMonth)) {
        const day = dateTime.getDay();
        const monthIndex = dateTime.getMonth();
        const year = dateTime.getFullYear();
        const hour = dateTime.getHours();
        const min = dateTime.getMinutes();
        const sec = dateTime.getSeconds();

        return day + "." + (monthIndex+1) + "." + year + " " + hour + ":" + min + ":" + sec;
    }
    return null;
}

function logDebug(text) {
    console.debug(PK_TRANSLATE_APP_NAME + ": [" + getFormattedDateTime(new Date()) + "] " + text);
}

function logError(text) {
    console.error(PK_TRANSLATE_APP_NAME + ": [" + getFormattedDateTime(new Date()) + "] " + text);
}

/*function restoreOptions() {
    let storageItem = browser.storage.managed.get('yandexTranslateApiKey');
    storageItem.then((res) => {
        document.querySelector("#managed-colour").innerText = res.colour;
    });

    let gettingItem = browser.storage.sync.get('colour');
    gettingItem.then((res) => {
        document.querySelector("#yandexApiKey").value = res.colour || 'Firefox red';
    });

}*/

document.addEventListener('DOMContentLoaded', restoreOptions);
//////////////////////////////////////////////////////////////////////

function saveOptions() {
    const dataForSave = {
        yandexTranslateApiKey: document.querySelector(PK_TRANSLATE_OPTIONS_INPUT_ID_YANDEX_API_KEY).value
    };
    browser.storage.local.set(dataForSave).then(function(result){
        logDebug("Save options successful: " + result);
    }, function(error) {
        logError("Save options error: " + error);
    });
}

function restoreOptions() {
    browser.storage.local.get(PK_TRANSLATE_OPTIONS_KEY_YANDEX_API_KEY).then (function(result) {
        if (result instanceof Array && result.length === 1) { //for old Firefox
            logDebug("Old Firefox request: " + result[0]);
        } else { //for new Firefox
            logDebug("New Firefox request: " + result);
        }
    }, function(error) {
        logError("Error:" + error);
    });

    // let storageItem = browser.storage.managed.get('yandexTranslateApiKey');
    // storageItem.then((result) => {
    //     document.querySelector("#yandexTranslateApiKey").innerText = result;
    // });
    //
    // let gettingItem = browser.storage.sync.get('yandexTranslateApiKey');
    // gettingItem.then((result) => {
    //     document.querySelector("#yandexTranslateApiKey").value = result.colour || 'Firefox red';
    // });
}

function saveOnSubmit(e) {
    saveOptions();
    e.preventDefault();
}

// document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector("form").addEventListener("submit", saveOnSubmit);

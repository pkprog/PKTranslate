const PK_TRANSLATE_APP_NAME = "PKTranslate.options";
const PK_TRANSLATE_OPTIONS_INPUT_ID_YANDEX_API_KEY = "#yandexApiKey";

function logDebug(text) {
    serviceFunctions.logDebugApplication(PK_TRANSLATE_APP_NAME, text);
}

function logError(text) {
    serviceFunctions.logErrorApplication(PK_TRANSLATE_APP_NAME, text);
}

document.addEventListener('DOMContentLoaded', restoreOptions);
//////////////////////////////////////////////////////////////////////

function saveOptions() {
    const dataForSave = {};
    dataForSave[PK_TRANSLATE_OPTIONS_KEY_YANDEX_API_KEY] = document.querySelector(PK_TRANSLATE_OPTIONS_INPUT_ID_YANDEX_API_KEY).value;

    browser.storage.local.set(dataForSave).then(function(result){
        logDebug("Saving options successful: " + result);
    }, function(error) {
        logError("Saving options error: " + error);
    });
}

function restoreOptions() {
    browser.storage.local.get(PK_TRANSLATE_OPTIONS_KEY_YANDEX_API_KEY).then(function(result) {
        logDebug("Restore options successful");
        if (result instanceof Array && result.length === 1) { //for old Firefox
            logDebug("Restore options: Old Firefox request: " + result[0][PK_TRANSLATE_OPTIONS_KEY_YANDEX_API_KEY]);
        } else { //for new Firefox
            logDebug("Restore options: New Firefox request: " + result[PK_TRANSLATE_OPTIONS_KEY_YANDEX_API_KEY]);
        }
    }, function(error) {
        logError("Error restoring options:" + error);
    });
}

function saveOnSubmit(e) {
    saveOptions();
    e.preventDefault();
}

// document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector("form").addEventListener("submit", saveOnSubmit);

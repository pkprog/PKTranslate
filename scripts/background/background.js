const PK_TRANSLATE_APP_NAME = "PKTranslate.background";
const PK_TRANSLATE_OPTIONS_KEY_YANDEX_API_KEY = "yandexTranslateApiKey";

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

logDebug("loaded");

browser.browserAction.onClicked.addListener(toggleStartTranslate);

/**
 * Click-handler.
 * If we couldn't inject the script, handle the error.
 */
function toggleStartTranslate() {
    logDebug("toggle StartTranslate");

    clickStartTranslate();
    // browser.tabs.executeScript({file: "/scripts/webpage/content_script.js"})
    //     .then(clickStartTranslate)
    //     .catch(reportExecuteScriptError);
}
/**
 * Click button "Translate"
 */
function clickStartTranslate() {
    browser.tabs.query({currentWindow: true, active: true}).then(function(result) {
        logDebug("message send to content_script script");
        browser.tabs.sendMessage(result[0].id, {
            command: "askSelected"
        });
    }, function(error) {
        logDebug("error getting current tab");
    });
}

/**
 * There was an error executing the script.
 * Display the popup's error message, and hide the normal UI.
 */
function reportExecuteScriptError(error) {
    // document.querySelector("#popup-content").classList.add("hidden");
    // document.querySelector("#error-content").classList.remove("hidden");
    logError("Failed to execute PKTranslate content script: ${error.message}");
}

//******************************************************************************
/**
 * Listen for messages from the content_script.
 */
browser.runtime.onMessage.addListener((message) => {
    logDebug("message received from content_script script");
    if (message.command === "takeSelected") {
        const selected = message.selected;
        logDebug(selected);

        restoreOptions(function(apiKey){
            translatorByYandex.doTranslate(selected, apiKey, function(text) {
                logDebug("Get translated text: "+ text);
            });
        });
    }
});

function restoreOptions(makeAfterRestoreFunction) {
    browser.storage.local.get(PK_TRANSLATE_OPTIONS_KEY_YANDEX_API_KEY).then(function(result) {
        let apiKey;
        if (result instanceof Array && result.length === 1) { //for old Firefox
            logDebug("Old Firefox request: " + result[0][PK_TRANSLATE_OPTIONS_KEY_YANDEX_API_KEY]);
            apiKey = result[0][PK_TRANSLATE_OPTIONS_KEY_YANDEX_API_KEY];
        } else { //for new Firefox
            logDebug("New Firefox request: " + result[PK_TRANSLATE_OPTIONS_KEY_YANDEX_API_KEY]);
            apiKey = result[PK_TRANSLATE_OPTIONS_KEY_YANDEX_API_KEY];
        }
        makeAfterRestoreFunction(apiKey);
    }, function(error) {
        logError("Error:" + error);
    });
}

const PK_TRANSLATE_APP_NAME = "PKTranslate.background";

function logDebug(text) {
    serviceFunctions.logDebugApplication(PK_TRANSLATE_APP_NAME, text);
}

function logError(text) {
    serviceFunctions.logErrorApplication(PK_TRANSLATE_APP_NAME, text);
}

logDebug("loaded");

// browser.browserAction.onClicked.addListener(function(e) {
//     toggleStartTranslate();
// });

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
    logDebug("message received");
    if (message.command === "PANEL_SCRIPT_LOADED") {
        logDebug("message PANEL_SCRIPT_LOADED received from panel_script script");
        clickStartTranslate();
    } else
    if (message.command === "takeSelected") {
        logDebug("message received from content_script script");
        const selected = message.selected;
        logDebug(selected);

        restoreOptions(function(apiKey){
            if (!serviceFunctions.isDefined(apiKey) || apiKey === null) {
                logError("Yandex API key value not defined");
            }
            translatorByYandex.doTranslate(selected, apiKey, function(text) {
                logDebug("Get translated text: "+ text);

                browser.runtime.sendMessage(null, {
                    command: "TRANSLATED_TEXT",
                    text: text
                });
            });
        });
    }
});

function restoreOptions(doAfterRestoreFunction) {
    browser.storage.local.get(PK_TRANSLATE_OPTIONS_KEY_YANDEX_API_KEY).then(function(result) {
        let apiKey;
        if (result instanceof Array && result.length === 1) { //for old Firefox
            logDebug("Old Firefox request: " + result[0][PK_TRANSLATE_OPTIONS_KEY_YANDEX_API_KEY]);
            apiKey = result[0][PK_TRANSLATE_OPTIONS_KEY_YANDEX_API_KEY];
        } else { //for new Firefox
            logDebug("New Firefox request: " + result[PK_TRANSLATE_OPTIONS_KEY_YANDEX_API_KEY]);
            apiKey = result[PK_TRANSLATE_OPTIONS_KEY_YANDEX_API_KEY];
        }
        doAfterRestoreFunction(apiKey);
    }, function(error) {
        logError("Error:" + error);
    });
}

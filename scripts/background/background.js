const PK_TRANSLATE_APP_NAME = "PKTranslate.background";

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
    logDebug("message from content_script script received");
    if (message.command === "takeSelected") {
        let selected = message.selected;
        logDebug(selected);
    }
});


// browser.browserAction.onClicked.addListener(toggleStartTranslate);

/**
 * Click-handler.
 * If we couldn't inject the script, handle the error.
 */
browser.tabs.executeScript({file: "/scripts/webpage/content_script.js"})
    .then(clickStartTranslate)
    .catch(reportExecuteScriptError);

/**
 * Click button "Translate"
 */
function clickStartTranslate() {
    browser.tabs.sendMessage(tabs[0].id, {
        command: "askSelected"
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
    if (message.command === "takeSelected") {
        let selected = message.selected;
        logDebug(selected);
    }
});


const PK_TRANSLATE_APP_NAME = "PKTranslate.content_script";

function logDebug(text) {
    serviceFunctions.logDebugApplication(PK_TRANSLATE_APP_NAME, text);
}

function logError(text) {
    serviceFunctions.logErrorApplication(PK_TRANSLATE_APP_NAME, text);
}

logDebug("loaded");

/**
 * Listen for messages from the background script.
 */
browser.runtime.onMessage.addListener((message) => {
    logDebug("message from backgroupd script received");

    if (message.command === COMMANDS.BG_TAKE_SELECTED_TEXT) {
        const selected = getCurrentSelection();
        browser.runtime.sendMessage({
            command: COMMANDS.CS_RETURN_SELECTED_TEXT,
            selected: selected
        });
    }
});

function getCurrentSelection() {
    logDebug("*****Start getCurrentSelection");

    let selectionString = window.getSelection().toString();
    logDebug("*****window.getSelection()=" +  selectionString);

    if (selectionString !== null && selectionString.length > 0) {
        //ok
    } else {
        logDebug("*****Start searching selection in frames");

        let frames = window.frames;
        if (serviceFunctions.isDefined(frames) && frames !== null && serviceFunctions.isDefined(frames.length) && frames.length > 0) {
            selectionString = null;
            for (let i = 0; i < frames.length; i++) {
                let inFrameSelectionString = frames[i].getSelection().toString();
                if (inFrameSelectionString !== null && inFrameSelectionString.length > 0) {
                    selectionString = inFrameSelectionString;
                    logDebug("*****frame.getSelection()=" +  selectionString);
                    break;
                }
            }
        }
    }

    let result = null;
    if (selectionString !== null) {
        if (selectionString.length > MAX_SELECTION_STRING_LENGTH) {
            result = selectionString.substring(0, MAX_SELECTION_STRING_LENGTH);
        } else {
            result = selectionString;
        }
    } else {
        result = null;
    }

    return result;
}

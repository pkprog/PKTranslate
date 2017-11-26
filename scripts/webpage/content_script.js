const PK_TRANSLATE_APP_NAME = "PKTranslate.content_script";

// (function() {
    /*
     * Check and set a global guard variable.
     * If this content script is injected into the same page again,
     * it will do nothing next time.
     */
    // if (window.hasRunPKTranslator) {
    //     return;
    // }
    // window.hasRunPKTranslator = true;

    function isDefined(value) {
        return !(value === undefined);
    }

    function isFunction(functionName) {
        return (typeof functionName === 'function');
    }

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

    /**
     * Listen for messages from the background script.
     */
    browser.runtime.onMessage.addListener((message) => {
        logDebug("message from backgroupd script received");

        if (message.command === "askSelected") {
            const selected = getCurrentSelection();
            browser.runtime.sendMessage({
                command: "takeSelected",
                selected: selected
            });
        }
    });

    function getCurrentSelection() {
        logDebug("*****Start getCurrentSelection");

        const MAX_SELECTION_STRING_LENGTH = 400;
        // let selection = null;

        let selectionString = window.getSelection().toString();
        logDebug("*****window.getSelection()=" +  selectionString);

        if (selectionString !== null && selectionString.length > 0) {
            //ok
        } else {
            logDebug("*****Start searching selection in frames");

            let frames = window.frames;
            if (isDefined(frames) && frames !== null && isDefined(frames.length) && frames.length > 0) {
                selectionString = null;
                for (let i = 0; i < frames.length; i++) {
                    let inFrameSelectionString = frames[i].getSelection().toString();
                    if (inFrameSelectionString !== null && inFrameSelectionString.length > 0) {
                        selectionString = inFrameSelectionString;
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

    /**
     * Given a URL to a beast image, remove all existing beasts, then
     * create and style an IMG node pointing to
     * that image, then insert the node into the document.
     */
/*
    function insertBeast(beastURL) {
        removeExistingBeasts();
        let beastImage = document.createElement("img");
        beastImage.setAttribute("src", beastURL);
        beastImage.style.height = "100vh";
        beastImage.className = "beastify-image";
        document.body.appendChild(beastImage);
    }
*/


// })();


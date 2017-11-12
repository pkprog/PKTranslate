(function() {
    /**
     * Check and set a global guard variable.
     * If this content script is injected into the same page again,
     * it will do nothing next time.
     */
    if (window.hasRunPKTranslator) {
        return;
    }
    window.hasRunPKTranslator = true;

    /**
     * Listen for messages from the background script.
     */
    browser.runtime.onMessage.addListener((message) => {
        if (message.command === "askSelected") {
            let selected = getCurrentSelection();
            browser.runtime.sendMessage({
                command: "takeSelected",
                selected: selected
            });
        }
    });

    function getCurrentSelection() {
        logDebug("*****Start getCurrentSelection");

        const MAX_SELECTION_STRING_LENGTH = 400;

        let selection = window.getSelection();
        logDebug("*****window.getSelection()=" +  selection);
        if (isDefined(selection) && typeof selection === 'string' && selection != null && selection.toString().length > 0) {
            //ok
        } else {
            let frames = window.frames;
            if (isDefined(frames) && frames != null && isDefined(frames.length) && frames.length > 0) {
                selection = "";
                for (let i = 0; i < frames.length; i++) {
                    let inFrameSelection = frames[i].getSelection();
                    if (isDefined(inFrameSelection) && inFrameSelection != null &&inFrameSelection.toString() != null && inFrameSelection.toString().length > 0) {
                        selection = frames[i].getSelection().toString();
                        break;
                    }
                }
            }
        }

        let result = null;
        if (isDefined(selection) && selection != null) {
            if (selection.toString().length > MAX_SELECTION_STRING_LENGTH) {
                result = selection.toString().substring(0, MAX_SELECTION_STRING_LENGTH);
            } else {
                result = selection.toString();
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
    function insertBeast(beastURL) {
        removeExistingBeasts();
        let beastImage = document.createElement("img");
        beastImage.setAttribute("src", beastURL);
        beastImage.style.height = "100vh";
        beastImage.className = "beastify-image";
        document.body.appendChild(beastImage);
    }

    /**
     * Remove every beast from the page.
     */
    function removeExistingBeasts() {
        let existingBeasts = document.querySelectorAll(".beastify-image");
        for (let beast of existingBeasts) {
            beast.remove();
        }
    }


})();


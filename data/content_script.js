function isDefined(value) {
    return !(value === undefined);
};

function getCurrentSelection() {
    var MAX_SELECTION_STRING_LENGTH = 400;

//console.log("*****" +  window.getSelection().toString());
    var selection = window.getSelection();
    if (!isDefined(selection) || selection == null || selection.toString() == null || selection.toString().length == 0) {
        var frames = window.frames;
        if (isDefined(frames) && frames != null && isDefined(frames.length) && frames.length > 0) {
            selection = "";
            for (var i = 0; i < frames.length; i++) {
                var inFrameSelection = frames[i].getSelection();
                if (isDefined(inFrameSelection) && inFrameSelection != null &&inFrameSelection.toString() != null && inFrameSelection.toString().length > 0) {
                    selection += frames[i].getSelection().toString() + " ";
                }
            }
        }
    }
    var result = null;
    if (!isDefined(selection) || selection == null) {
        result = "";
    } else {
        if (selection.toString().length > MAX_SELECTION_STRING_LENGTH) {
            result = selection.toString().substring(0, MAX_SELECTION_STRING_LENGTH);
        } else {
            result = selection.toString();
        }
    }
    return result;
};

function process(){
    self.port.on("pktranslator-get-selected-text", function(message) {
        var selectedText = getCurrentSelection();
        self.port.emit("pktranslator-select-received", selectedText);
    });
};

process();

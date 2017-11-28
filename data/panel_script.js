const PK_TRANSLATE_APP_NAME = "PKTranslate.panel_script";

function logDebug(text) {
    serviceFunctions.logDebugApplication(PK_TRANSLATE_APP_NAME, text);
}

function logError(text) {
    serviceFunctions.logErrorApplication(PK_TRANSLATE_APP_NAME, text);
}

logDebug("loaded");

document.addEventListener('DOMContentLoaded', sendMessageImLoaded);

function sendMessageImLoaded() {
    browser.runtime.sendMessage(null, {
        command: "PANEL_SCRIPT_LOADED"
    });
}

/**
 * Listen for messages with translated text
 */
browser.runtime.onMessage.addListener((message) => {
    if (message.command === "TRANSLATED_TEXT") {
        logDebug("message received with translated text");
        const text = message.text;
        logDebug(text);

        document.getElementById("translate-results").value = text;

        const licenceText = '«Переведено сервисом «Яндекс.Переводчик».&nbsp;<a href="http://translate.yandex.ru/" target' + ' ="_blank">http://translate.yandex.ru/</a>';
        document.getElementById('yandex-licence').innerHTML = licenceText;
    }
});


/*
self.port.on("pktranslator-translate-received", function(text) {
    if (!(text === undefined) && text != null && typeof text === 'string' && text.length > 0) {
        document.getElementById('translate-results').value = text;

        var licenceText = '«Переведено сервисом «Яндекс.Переводчик».&nbsp;<a href="http://translate.yandex.ru/" target' + ' ="_blank">http://translate.yandex.ru/</a>';
        document.getElementById('yandex-licence').innerHTML = licenceText;
    }
    //console.log("panel get text:" + text);
});

self.port.on("pktranslator-error", function(errorText) {
    if (!(errorText === undefined) && errorText != null && typeof errorText === 'string' && errorText.length > 0) {
        document.getElementById('translate-results').value = errorText;
    }
    //console.log("panel get text:" + text);
});
*/

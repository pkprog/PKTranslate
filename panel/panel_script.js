const PK_TRANSLATE_APP_NAME = "PKTranslate.panel_script";

function logDebug(text) {
    serviceFunctions.logDebugApplication(PK_TRANSLATE_APP_NAME, text);
}

function logError(text) {
    serviceFunctions.logErrorApplication(PK_TRANSLATE_APP_NAME, text);
}

logDebug("loaded");

document.addEventListener('DOMContentLoaded', function() {
    browser.runtime.sendMessage(null, {
        command: COMMANDS.PANEL_SCRIPT_LOADED
    });
});

/**
 * Listen for messages with translated text
 */
browser.runtime.onMessage.addListener((message) => {
    if (message.command === COMMANDS.PANEL_TRANSLATED_TEXT) {
        logDebug("message received with translated text");
        const text = message.text;
        logDebug(text);

        document.getElementById("translate-results").value = text;

        const licenceText = '«Переведено сервисом «Яндекс.Переводчик».&nbsp;<a href="http://translate.yandex.ru/" target' + ' ="_blank">http://translate.yandex.ru/</a>';
        document.getElementById('yandex-licence').innerHTML = licenceText;
    }
});

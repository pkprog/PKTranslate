const PK_TRANSLATE_APP_NAME = "PKTranslate.panel_script";

function isDefined(value) {
    return !(value === undefined);
}

function isFunction(functionName) {
    return (typeof functionName == 'function');
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
 * Listen for messages with translated text
 */
browser.runtime.onMessage.addListener((message) => {
    logDebug("message received with translated text");
    if (message.command === "translatedText") {
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

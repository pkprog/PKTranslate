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

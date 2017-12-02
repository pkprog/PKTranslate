let translatorByYandex = {
    getLinkForGetLangs: function(apiKey) {
        var linkGetLangs = 'https://translate.yandex.net/api/v1.5/tr.json/getLangs?key=' + apiKey + "&ui=" + "ru";
        return linkGetLangs;
    },
    getLinkForGetTranslate: function(wordForTranslate, apiKey) {
        if (!serviceFunctions.isDefined(wordForTranslate) || wordForTranslate === null || typeof wordForTranslate !== 'string' || wordForTranslate.trim().length === 0) {
            return null;
        }
        return 'https://translate.yandex.net/api/v1.5/tr.json/translate?key=' + apiKey + '&lang=' + 'en-ru' + '&text=' + wordForTranslate + '&format=html';
    },
    getLangs: function() {
        return;

        /*
                $.ajax({
                    url: translatorByYandex.getLinkForGetLangs(),
                    dataType: 'json',
                    method: 'GET',
                    context: document.body,
                    //jsonp: 'callback',
                    //jsonpCallback: function() {
                    //    console.log("*****Callback");
                    //},
                    async: false,
                    success: translatorByYandex.requestLangsSuccess,
                });
        */
    },
    requestLangsSuccess: function(request, status) {
        logError("Method not implemented");
    },
    sanitizeTextForUrl: function(text) {
        const result = text.replace(/\t/g, ' ').replace(/\n/g, ' ').replace(/\r/g, ' ').replace(/\b/g, ' ').replace(/\f/g, ' ').trim();
        return result;
    },
    doTranslate: function(textForTranslate, yandexTranslateApiKey, callbackFunctionForTranslatedText) {
        if (textForTranslate === null || textForTranslate.length === 0) {
            logDebug("Text for translate is null");
            return null;
        }
        if (yandexTranslateApiKey === null || yandexTranslateApiKey.length === 0) {
            logError("Yandex API key not defined");
            return "Не указан Yandex API key. Пожалуйста, укажите его в настройках";
        }
        if (callbackFunctionForTranslatedText === null || !serviceFunctions.isFunction(callbackFunctionForTranslatedText)) {
            logError("Callback function not defined!!!");
            return null;
        }

        const urlString = this.getLinkForGetTranslate(this.sanitizeTextForUrl(textForTranslate), yandexTranslateApiKey);
        if (urlString === null || urlString.length === 0) return null;

        let httpRequest = new XMLHttpRequest();
        httpRequest.responseType = "json";
        httpRequest.addEventListener("load", function(event) {
            logDebug("Request result event:" + event);
            const text = translatorByYandex.translateComplete(this.response);

            if (serviceFunctions.isFunction(callbackFunctionForTranslatedText)) {
                callbackFunctionForTranslatedText(text);
            }
        });
        httpRequest.addEventListener("error", function(event) {
            logError("Error in httpRequest to Yandex: "+ event);
        });
        httpRequest.open("GET", urlString, true);

        logDebug("Start traslate request for: " + textForTranslate);
        httpRequest.send();
    },
    translateComplete: function(response) {
        logDebug("Translate complete");
        let resultString = "";

        if (serviceFunctions.isDefined(response) && response !== null && response.code === 200) {
            if (Array.isArray(response.text) && response.text.length > 0) {
                response.text.forEach(function(item, i, arr) {
                    if (item !== null && typeof item === 'string' && item.trim().length > 0) {
                        if (resultString.length > 0) {
                            resultString += "\n";
                        }
                        resultString += item.trim();
                    }
                });
            } else {
                resultString = "ERROR:" + JSON.stringify(response.text);
            }
        } else {
            logError("ERROR parsing response: "+ response.code + "." + response.message);
            resultString = "ERROR:" + response.code + "." + response.message;
        }

        return resultString;
    }

};

// 401 Неправильный API-ключ
// 402 API-ключ заблокирован
// 404 Превышено суточное ограничение на объем переведенного текста
// 413 Превышен максимально допустимый размер текста
// 422 Текст не может быть переведен
// 501 Заданное направление перевода не поддерживается
//и другие ошибки
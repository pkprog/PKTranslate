var translatorByYandex = {
    getYandexTranslateApiKey: function() {
        let yandexTranslateApiKey = simplePrefsModule.prefs['yandexTranslateApiKey'];
        if (!utils.isDefined(yandexTranslateApiKey) || yandexTranslateApiKey == null || yandexTranslateApiKey.trim().length == 0) {
            console.log("*****Preference yandexTranslateApiKey is NULL");
            yandexTranslateApiKey = null;
        } else {
            yandexTranslateApiKey = yandexTranslateApiKey.trim();
        }
        return yandexTranslateApiKey;
    },
    getLinkForGetLangs: function() {
        var linkGetLangs = 'https://translate.yandex.net/api/v1.5/tr.json/getLangs?key=' + this.getYandexTranslateApiKey() + "&ui=" + "ru";
        return linkGetLangs;
    },
    getLinkForGetTranslate: function(wordForTranslate) {
        if (!utils.isDefined(wordForTranslate) || wordForTranslate == null || typeof wordForTranslate !== 'string' || wordForTranslate.trim().length == 0) {
            return null;
        }
        return 'https://translate.yandex.net/api/v1.5/tr.json/translate?key=' + this.getYandexTranslateApiKey() + '&lang=' + 'en-ru' + '&text=' + wordForTranslate + '&format=html';
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
        console.log("*****requestLangsSuccess");
    },
    sanitizeTextForUrl: function(text) {
        var result = text.replace(/\t/g, ' ').replace(/\n/g, ' ').replace(/\r/g, ' ').replace(/\b/g, ' ').replace(/\f/g, ' ').trim();
        return result;
    },
    doTranslate: function(textForTranslate, yandexTranslateApiKey, callbackFunctionForTranslatedText) {
        if (textForTranslate === null || textForTranslate.length === 0) {
            logDebug("Text for translate is null");
            return null;
        }
        if (yandexTranslateApiKey === null || yandexTranslateApiKey.length === 0) {
            logError("Yandex API key not defined");
            return null;
        }
        if (callbackFunctionForTranslatedText === null || !isFunction(callbackFunctionForTranslatedText)) {
            logError("Callback function not defined!!!");
            return null;
        }

        const urlString = this.getLinkForGetTranslate(this.sanitizeTextForUrl(textForTranslate));
        if (urlString === null || urlString.length === 0) return null;

        let httpRequest = new XMLHttpRequest();
        httpRequest.responseType = "json";
        httpRequest.addEventListener("load", function(response) {
            logDebug("Request result:" + response);
            const text = translatorByYandex.translateComplete(response);

            if (isFunction(callbackFunctionForTranslatedText)) {
                callbackFunctionForTranslatedText(text);
            }
        });
        httpRequest.open("GET", urlString, false);
        httpRequest.send();




        // let requestModule = require("sdk/request").Request;
        // let res = requestModule({
        //     url: urlString,
        //     onComplete: function(response) {
        //         var text = translatorByYandex.translateComplete(response);
        //
        //         if (utils.isFunction(callbackFunctionForTranslatedText)) {
        //             callbackFunctionForTranslatedText(text);
        //         }
        //     }
        // });

        // res.get();
    },
    translateComplete: function(response) {
        logDebug("Translate complete");
        let resultString = "";

        if (isDefined(response) && response !== null) {
            if (isDefined(response.json) && response.json !== null) {
                if (response.json.code !== 200) {
                    resultString = response.json.message;
                } else {
                    if (Array.isArray(response.json.text) && response.json.text.length > 0) {
                        response.json.text.forEach(function(item, i, arr) {
                            if (item !== null && typeof item === 'string' && item.trim().length > 0) {
                                if (resultString.length > 0) {
                                    resultString += "\n";
                                }
                                resultString += item.trim();
                            }
                        });
                        //console.log(JSON.stringify(jsonObject.text[0]));
                    } else {
                        resultString = "ERROR:" + JSON.stringify(response.json);
                    }
                }
            }
        }

        return resultString;
    }

};

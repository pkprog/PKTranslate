//Загрузка модулей
var buttonModule = require("sdk/ui/button/action");
var dataModule = require("sdk/self").data;
var simplePrefsModule = require("sdk/simple-prefs");
var utils = require("./lib/utils");

var currentWorker = {
    worker: null,
    tab: null,
    tabUrl: null
};

// Create a button
buttonModule.ActionButton({
    id: "translate-selected-text",
    label: "Перевести выделенный текст",
    icon: {
        "16": "./translate-16.png",
        "32": "./translate-32.png",
        "64": "./translate-64.png"
    },
    onClick: buttonTranslateClick
});

// Show the panel when the user clicks the button.
function buttonTranslateClick(state) {
    //console.log("Button clicked");
    var panelModule = require("sdk/panel");
    var panelShowOptions = {
        width: 470,
        height: 140
    };

    var translateResultsPanel = panelModule.Panel({
        contentURL: dataModule.url("panel_body.html"),
        contentScriptFile: dataModule.url("panel_script.js")
    });

    if (translatorByYandex.getYandexTranslateApiKey() == null) {
        var translatedText = "Пожалуйста укажите ключ Yandex.Translate API в настройках дополнения";
        translatedText += "\n";
        translatedText += "Please set Yandex.Translate API key in extension settings"
        translateResultsPanel.show(panelShowOptions);
        translateResultsPanel.port.emit("pktranslator-error", translatedText);
        return;
    }

    var tabsModule = require("sdk/tabs");

    if (currentWorker.worker == null) {
        currentWorker.worker = tabsModule.activeTab.attach({
            contentScriptFile: [dataModule.url("content_script.js")]
            //contentScriptOptions: {"yandexTranslateApiKey": simplePrefsModule.prefs['yandexTranslateApiKey']}
        });
        currentWorker.tab = tabsModule.activeTab;
        currentWorker.tabUrl = tabsModule.activeTab.url;

        currentWorker.worker.port.on("pktranslator-select-received", function(selectedText) {
            if (selectedText == null || selectedText.trim().length == 0) return;

            //console.log("*****Request start");
            translatorByYandex.doTranslate(selectedText, function(translatedText) {
                translateResultsPanel.show(panelShowOptions);
                translateResultsPanel.port.emit("pktranslator-translate-received", translatedText);
            });
        });

        currentWorker.worker.port.emit("pktranslator-get-selected-text", "");
    } else {
        if (currentWorker.tab === tabsModule.activeTab && currentWorker.tabUrl === tabsModule.activeTab.url) {
            currentWorker.worker.port.emit("pktranslator-get-selected-text", "");
        } else {
            currentWorker.worker.destroy();
            currentWorker.worker = null;
            currentWorker.tab = null;

            currentWorker.worker = tabsModule.activeTab.attach({
                contentScriptFile: [dataModule.url("content_script.js")]
                //contentScriptOptions: {"yandexTranslateApiKey": simplePrefsModule.prefs['yandexTranslateApiKey']}
            });
            currentWorker.tab = tabsModule.activeTab;
            currentWorker.tabUrl = tabsModule.activeTab.url;

            currentWorker.worker.port.on("pktranslator-select-received", function(selectedText) {
                if (selectedText == null || selectedText.trim().length == 0) return;

                //console.log("*****Request start");
                translatorByYandex.doTranslate(selectedText, function(translatedText) {
                    translateResultsPanel.show(panelShowOptions);
                    translateResultsPanel.port.emit("pktranslator-translate-received", translatedText);
                });
            });

            currentWorker.worker.port.emit("pktranslator-get-selected-text", "");
        }
    }

};

//simplePrefsModule.on("yandexTranslateApiKey", function(preferenceName) {
//    console.log("The preference " + preferenceName +" value has changed!");
//});

var translatorByYandex = {
    getYandexTranslateApiKey: function() {
        var yandexTranslateApiKey = simplePrefsModule.prefs['yandexTranslateApiKey'];
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
    doTranslate: function(textForTranslate, callbackFunctionForTranslatedText) {
        var urlString = this.getLinkForGetTranslate(this.sanitizeTextForUrl(textForTranslate));
        if (urlString == null || urlString.length == 0) return;

        var requestModule = require("sdk/request").Request;
        var res = requestModule({
            url: urlString,
            onComplete: function(response) {
                var text = translatorByYandex.translateComplete(response);

                if (utils.isFunction(callbackFunctionForTranslatedText)) {
                    callbackFunctionForTranslatedText(text);
                }
            }
        });

        res.get();
    },
    translateComplete: function(response) {
        console.log("*****Translate complete");
        var resultString = "";

        if (utils.isDefined(response) && response != null) {
            if (utils.isDefined(response.json) && response.json != null) {
                if (response.json.code != 200) {
                    resultString = response.json.message;
                } else {
                    if (Array.isArray(response.json.text) && response.json.text.length > 0) {
                        response.json.text.forEach(function(item, i, arr) {
                            if (item != null && typeof item === 'string' && item.trim().length > 0) {
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


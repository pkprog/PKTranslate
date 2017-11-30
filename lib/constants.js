const PK_TRANSLATE_OPTIONS_KEY_YANDEX_API_KEY = "yandexTranslateApiKey";
const MAX_SELECTION_STRING_LENGTH = 400;

const COMMANDS = {
    PANEL_SCRIPT_LOADED: "PANEL_SCRIPT_LOADED",
    PANEL_TRANSLATED_TEXT: "PANEL_TRANSLATED_TEXT",
    //
    BG_TAKE_SELECTED_TEXT: "BG_TAKE_SELECTED_TEXT",
    CS_RETURN_SELECTED_TEXT: "CS_RETURN_SELECTED_TEXT",
};

const Command = function(textCommand) {
    this.command = textCommand;
    this.unid = new Date().getTime();
};
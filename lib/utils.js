const serviceFunctions = {
    isDefined: function(value) {
        return !(value === undefined);
    },
    isFunction: function(functionName) {
        return (typeof functionName == 'function');
    },
    getFormattedDateTime: function(dateTime) {
        if (this.isFunction(dateTime.getMonth)) {
            const day = dateTime.getDay();
            const monthIndex = dateTime.getMonth();
            const year = dateTime.getFullYear();
            const hour = dateTime.getHours();
            const min = dateTime.getMinutes();
            const sec = dateTime.getSeconds();

            return day + "." + (monthIndex+1) + "." + year + " " + hour + ":" + min + ":" + sec;
        }
        return null;
    },
    logDebugApplication: function(appName, text) {
        console.debug(appName + ": [" + this.getFormattedDateTime(new Date()) + "] " + text);
    },
    logErrorApplication: function(appName, text) {
        console.error(appName + ": [" + this.getFormattedDateTime(new Date()) + "] " + text);
    }
};

// function logDebug(text) {
//     console.debug(text);
// }
//
// function logError(text) {
//     console.error(text);
// }

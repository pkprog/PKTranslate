function isDefined(value) {
    return !(value === undefined);
}

function isFunction(functionName) {
    return (typeof functionName == 'function');
}

function logDebug(text) {
    console.debug(text);
}

function logError(text) {
    console.error(text);
}

// exports.isDefined = isDefined;
// exports.isFunction = isFunction;

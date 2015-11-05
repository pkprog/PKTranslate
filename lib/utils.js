function isDefined(value) {
    return !(value === undefined);
}

function isFunction(functionName) {
    return (typeof functionName == 'function');
}

exports.isDefined = isDefined;
exports.isFunction = isFunction;

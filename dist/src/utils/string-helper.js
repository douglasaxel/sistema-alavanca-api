"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBase64MimeTypeAndValue = exports.removeSpacesFromString = exports.getNumbersFromString = void 0;
function getNumbersFromString(value) {
    return value.replace(/(\D)/g, '').replace(/(\d)/, '$1');
}
exports.getNumbersFromString = getNumbersFromString;
function removeSpacesFromString(value) {
    return value.replace(/\s/g, '');
}
exports.removeSpacesFromString = removeSpacesFromString;
function getBase64MimeTypeAndValue(base64) {
    const [dataType, b64] = base64.split(',');
    return {
        base64: b64,
        mimeType: dataType.replace(/(data:|;|base64)/g, ''),
    };
}
exports.getBase64MimeTypeAndValue = getBase64MimeTypeAndValue;
//# sourceMappingURL=string-helper.js.map
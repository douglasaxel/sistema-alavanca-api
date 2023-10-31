"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.excludeKeyFromObj = void 0;
function excludeKeyFromObj(obj, keys) {
    if (Array.isArray(obj)) {
        obj.forEach(function (item) {
            excludeKeyFromObj(item, keys);
        });
    }
    else if (typeof obj === 'object' && obj != null) {
        Object.getOwnPropertyNames(obj).forEach(function (key) {
            if (keys.indexOf(key) !== -1)
                delete obj[key];
            else
                excludeKeyFromObj(obj[key], keys);
        });
    }
}
exports.excludeKeyFromObj = excludeKeyFromObj;
//# sourceMappingURL=exclude-key-from-obj.js.map
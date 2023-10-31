"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = exports.format = exports.validate = void 0;
function digit(numbers) {
    let index = 2;
    const sum = [...numbers].reverse().reduce((buffer, number) => {
        buffer += Number(number) * index;
        index = index === 9 ? 2 : index + 1;
        return buffer;
    }, 0);
    const mod = sum % 11;
    return mod < 2 ? 0 : 11 - mod;
}
function validate(cnpj) {
    const cleaned = cnpj.replace(/(\D)/g, '').replace(/(\d)/, '$1');
    if (cleaned.length !== 14 ||
        /^(\d)\1+$/.test(cleaned)) {
        return false;
    }
    let registration = cleaned.slice(0, 12);
    registration += digit(registration);
    registration += digit(registration);
    return registration.slice(-2) === cleaned.slice(-2);
}
exports.validate = validate;
function format(cnpj) {
    return (cnpj
        .replace(/[^\d]/g, '')
        .replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5'));
}
exports.format = format;
function generate() {
    let cnpj = '';
    let i = 12;
    while (i--) {
        cnpj += Math.floor(Math.random() * 9);
    }
    cnpj += digit(cnpj);
    cnpj += digit(cnpj);
    return format(cnpj);
}
exports.generate = generate;
//# sourceMappingURL=cnpj.js.map
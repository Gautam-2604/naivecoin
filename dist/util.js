"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hexToBinary = void 0;
const hexToBinary = (s) => {
    let ret = '';
    const lookupTable = {
        '0': '0000', '1': '0001', '2': '0010', '3': '0011', '4': '0100',
        '5': '0101', '6': '0110', '7': '0111', '8': '1000', '9': '1001',
        'a': '1010', 'b': '1011', 'c': '1100', 'd': '1101',
        'e': '1110', 'f': '1111'
    };
    for (let i = 0; i < s.length; i = i + 1) {
        //@ts-ignore
        if (lookupTable[s[i]]) {
            //@ts-ignore
            ret += lookupTable[s[i]];
        }
        else {
            //@ts-ignore
            return null;
        }
    }
    return ret;
};
exports.hexToBinary = hexToBinary;

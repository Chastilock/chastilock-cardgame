"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ALL_YELLOWS = exports.isYellowCard = void 0;
var CardType;
(function (CardType) {
    CardType["GREEN"] = "GREEN";
    CardType["RED"] = "RED";
    CardType["STICKY"] = "STICKY";
    CardType["YELLOW_PLUS1"] = "YELLOW+1";
    CardType["YELLOW_PLUS2"] = "YELLOW+2";
    CardType["YELLOW_PLUS3"] = "YELLOW+3";
    CardType["YELLOW_MINUS1"] = "YELLOW-1";
    CardType["YELLOW_MINUS2"] = "YELLOW-2";
    CardType["YELLOW_MINUS3"] = "YELLOW-3";
    CardType["FREEZE"] = "FREEZE";
    CardType["DOUBLE"] = "DOUBLE";
    CardType["RESET"] = "RESET";
})(CardType || (CardType = {}));
exports.isYellowCard = (type) => type.toString().startsWith('YELLOW');
exports.ALL_YELLOWS = [
    CardType.YELLOW_PLUS1,
    CardType.YELLOW_PLUS2,
    CardType.YELLOW_PLUS3,
    CardType.YELLOW_MINUS1,
    CardType.YELLOW_MINUS2,
    CardType.YELLOW_MINUS3
];
exports.default = CardType;
//# sourceMappingURL=CardType.js.map
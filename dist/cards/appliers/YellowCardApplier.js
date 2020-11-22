"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const CardType_1 = __importStar(require("../../model/CardType"));
const mapping = {
    [CardType_1.default.YELLOW_PLUS1.toString()]: 1,
    [CardType_1.default.YELLOW_PLUS2.toString()]: 2,
    [CardType_1.default.YELLOW_PLUS3.toString()]: 3,
    [CardType_1.default.YELLOW_MINUS1.toString()]: -1,
    [CardType_1.default.YELLOW_MINUS2.toString()]: -2
};
class YellowCardApplier {
    canHandle(type) {
        return CardType_1.isYellowCard(type);
    }
    /**
     * Removes or adds red cards, based on the type of yellow card.
     * @param lock the lock to modify
     */
    apply(lock, type) {
        const difference = mapping[type.toString()];
        lock.getCards().setCardsOfType(CardType_1.default.RED, lock.getCards().getRed() + difference);
        lock.getCards().setCardsOfType(type, lock.getCards().getCardsOfType(type) - 1);
    }
}
exports.default = YellowCardApplier;
//# sourceMappingURL=YellowCardApplier.js.map
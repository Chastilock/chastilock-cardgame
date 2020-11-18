"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CardType_1 = __importDefault(require("../../model/CardType"));
class GreenCardApplier {
    canHandle(type) {
        return type === CardType_1.default.GREEN;
    }
    /**
     * Removes a green card.
     * @param lock the lock to modify
     */
    apply(lock) {
        // Amount of green cards is reduced by 1
        lock.getCards().setCardsOfType(CardType_1.default.GREEN, lock.getCards().getGreen() - 1);
        lock.greensDrawn = lock.greensDrawn + 1;
    }
}
exports.default = GreenCardApplier;
//# sourceMappingURL=GreenCardApplier.js.map
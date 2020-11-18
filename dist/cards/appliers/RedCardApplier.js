"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CardType_1 = __importDefault(require("../../model/CardType"));
class RedCardApplier {
    canHandle(type) {
        return type === CardType_1.default.RED;
    }
    /**
     * Removes a red card, and sets the next draw time to the current interval.
     * @param lock the lock to modify
     */
    apply(lock) {
        // Amount of red cards is reduced by 1
        lock.getCards().setCardsOfType(CardType_1.default.RED, lock.getCards().getRed() - 1);
        // Next draw time is set
        lock.doRegularCooldown();
    }
}
exports.default = RedCardApplier;
//# sourceMappingURL=RedCardApplier.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CardType_1 = __importDefault(require("../../model/CardType"));
class ResetCardApplier {
    canHandle(type) {
        return type === CardType_1.default.RESET;
    }
    /**
     * Performs a soft reset on the lock.
     * @param lock the lock to modify.
     */
    apply(lock) {
        lock.resetSoft();
        lock.getCards().setCardsOfType(CardType_1.default.RESET, lock.getCards().getReset() - 1);
    }
}
exports.default = ResetCardApplier;
//# sourceMappingURL=ResetCardApplier.js.map
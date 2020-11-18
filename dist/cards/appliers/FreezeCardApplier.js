"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CardType_1 = __importDefault(require("../../model/CardType"));
const Lock_test_1 = require("../../model/Lock.test");
class FreezeCardApplier {
    canHandle(type) {
        return type === CardType_1.default.FREEZE;
    }
    /**
     * Freeze cards set the next draw time to between
     * 2 and 4 times the interval.
     * @param lock the lock to modify.
     */
    apply(lock) {
        lock.resetSoft();
        const multiplier = 2 + Math.random() * 2;
        lock.nextDraw = Lock_test_1.lockConfig.intervalMinutes * multiplier;
        lock.getCards().setCardsOfType(CardType_1.default.FREEZE, lock.getCards().getFreeze() - 1);
    }
}
exports.default = FreezeCardApplier;
//# sourceMappingURL=FreezeCardApplier.js.map
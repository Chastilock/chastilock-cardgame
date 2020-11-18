"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CardType_1 = __importDefault(require("../../model/CardType"));
class StickyCardApplier {
    canHandle(type) {
        return type === CardType_1.default.STICKY;
    }
    /**
     * Does nothing but set the lock on cooldown.
     * @param lock the lock to modify
     */
    apply(lock) {
        // Next draw time is set
        lock.doRegularCooldown();
    }
}
exports.default = StickyCardApplier;
//# sourceMappingURL=StickyCardApplier.js.map
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
class DoubleCardApplier {
    canHandle(type) {
        return type === CardType_1.default.DOUBLE;
    }
    /**
     * Doubles all the red and yellow cards.
     * @param lock the lock to modify.
     */
    apply(lock) {
        lock.getCards().setCardsOfType(CardType_1.default.RED, lock.getCards().getRed() * 2);
        CardType_1.ALL_YELLOWS.forEach(yellowType => {
            lock.getCards().setCardsOfType(yellowType, lock.getCards().getCardsOfType(yellowType) * 2);
        });
        lock.getCards().setCardsOfType(CardType_1.default.DOUBLE, lock.getCards().getDouble() - 1);
    }
}
exports.default = DoubleCardApplier;
//# sourceMappingURL=DoubleCardApplier.js.map
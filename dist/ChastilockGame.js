"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CardApplierManager_1 = __importDefault(require("./cards/CardApplierManager"));
class ChastilockGame {
    constructor(config, lock) {
        this.manager = new CardApplierManager_1.default();
        this.config = config;
        this.lock = lock;
    }
    drawCard() {
        const drawn = this.lock.getCards().drawRandomType();
        // Apply the effects
        this.manager.apply(this.lock, drawn);
        // Limit the lock (to the configured max)
        this.lock.limit(this.config);
        return drawn;
    }
}
exports.default = ChastilockGame;
//# sourceMappingURL=ChastilockGame.js.map
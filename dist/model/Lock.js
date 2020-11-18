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
const CardType_1 = __importStar(require("./CardType"));
class Lock {
    constructor(config, cards) {
        this.nextDraw = 0;
        this.greensDrawn = 0;
        this.config = config;
        this.cards = cards;
    }
    /**
     * Sets draw time to current interval.
     */
    doRegularCooldown() {
        this.nextDraw = this.getConfig().intervalMinutes;
    }
    /**
     * Completely resets the lock to it's initial state.
     *
     * Also known as keyholder-reset.
     */
    resetHard() {
        const newMap = Object.assign({}, this.getConfig().initial.map);
        this.cards.map = newMap;
        this.greensDrawn = 0;
    }
    /**
     * Resets the number of green, red and yellow cards.
     *
     * Also known as reset-card reset.
     */
    resetSoft() {
        this.greensDrawn = 0;
        this.getCards().setCardsOfType(CardType_1.default.GREEN, this.getConfig().initial.getGreen());
        this.getCards().setCardsOfType(CardType_1.default.RED, this.getConfig().initial.getRed());
        // reset yellow cards
        CardType_1.ALL_YELLOWS.forEach((yellowType) => {
            this.getCards().setCardsOfType(yellowType, this.getConfig().initial.getCardsOfType(yellowType));
        });
    }
    getNextDraw() {
        return this.nextDraw;
    }
    getConfig() {
        return this.config;
    }
    getCards() {
        return this.cards;
    }
}
exports.default = Lock;
//# sourceMappingURL=Lock.js.map
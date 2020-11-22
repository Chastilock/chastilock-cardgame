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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CardMapping_1 = __importDefault(require("./CardMapping"));
const CardType_1 = __importStar(require("./CardType"));
class Lock {
    constructor(config, cards) {
        this.nextDraw = 0;
        this.greensDrawn = 0;
        this.config = config;
        if (cards !== undefined) {
            this.cards = cards;
        }
        else {
            this.cards = this.createCards();
        }
    }
    /**
     * Sets up the lock after first initialization. Performs the random logic
     * to define how many cards of what type are being used.
     *
     * May also be called when resetting.
     * @returns the initial CardMapping
     */
    createCards() {
        const cardMapping = new CardMapping_1.default();
        const getCardAmount = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
        CardType_1.ALL_CARDS.forEach(cardType => cardMapping.setCardsOfType(cardType, getCardAmount(this.getConfig().initial.min.getCardsOfType(cardType), this.getConfig().initial.max.getCardsOfType(cardType))));
        return cardMapping;
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
        this.cards = this.createCards();
        this.greensDrawn = 0;
    }
    /**
     * Resets the number of green, red and yellow cards.
     *
     * Also known as reset-card reset.
     */
    resetSoft() {
        // We'll only be using the red, green and yellow cards out of this.
        const completelyNewCards = this.createCards();
        this.greensDrawn = 0;
        const relevantCardTypes = [CardType_1.default.GREEN, CardType_1.default.RED, ...CardType_1.ALL_YELLOWS];
        relevantCardTypes.forEach(cardType => this.getCards().setCardsOfType(cardType, completelyNewCards.getCardsOfType(cardType)));
    }
    /**
     * Limits the lock to the configured maximum of cards
     * @param config the config to respect
     */
    limit(config) {
        this.getCards().map.forEach((value, key) => {
            const maxCards = config.max[key];
            if (maxCards !== 0 && maxCards !== undefined) {
                // apply the limit
                if (value > maxCards) {
                    this.getCards().setCardsOfType(key, maxCards);
                }
            }
        });
    }
    isFinished() {
        if (this.getConfig().multipleGreensRequired) {
            return this.greensDrawn !== 0 && this.getCards().getGreen() === 0;
        }
        else {
            return this.greensDrawn >= 1;
        }
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
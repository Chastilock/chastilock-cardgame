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
class CardMapping {
    constructor(map) {
        if (map !== undefined) {
            this.map = map;
        }
        else {
            this.map = new Map();
        }
    }
    getCardsOfType(type) {
        var _a;
        return (_a = this.map.get(type)) !== null && _a !== void 0 ? _a : 0;
    }
    setCardsOfType(type, cards) {
        this.map.set(type, cards);
    }
    /**
     * Draws a random card type of this set.
     */
    drawRandomType() {
        const totalCards = this.getTotalCards();
        let accumulator = 0;
        const chances = Object.values(this.map).map((element) => (accumulator = accumulator + element));
        const drawnIndex = Math.random() * totalCards;
        const drawnCard = Object.keys(this.map)[chances.filter(element => element <= drawnIndex).length];
        return drawnCard;
    }
    /**
     * Get total cards in this mapping
     */
    getTotalCards() {
        return Object.values(this.map).reduce((prev, cur) => prev + cur, 0);
    }
    getGreen() {
        return this.getCardsOfType(CardType_1.default.GREEN);
    }
    getRed() {
        return this.getCardsOfType(CardType_1.default.RED);
    }
    getSticky() {
        return this.getCardsOfType(CardType_1.default.STICKY);
    }
    getFreeze() {
        return this.getCardsOfType(CardType_1.default.FREEZE);
    }
    getDouble() {
        return this.getCardsOfType(CardType_1.default.DOUBLE);
    }
    getReset() {
        return this.getCardsOfType(CardType_1.default.RESET);
    }
    getYellow() {
        let yellow = 0;
        this.map.forEach((value, key) => {
            if (CardType_1.isYellowCard(key)) {
                yellow = yellow + value;
            }
        });
        return yellow;
    }
}
exports.default = CardMapping;
//# sourceMappingURL=CardMapping.js.map
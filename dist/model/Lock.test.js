"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.lockConfig = void 0;
const Lock_1 = __importDefault(require("./Lock"));
const CardMapping_1 = __importDefault(require("./CardMapping"));
const CardType_1 = __importDefault(require("./CardType"));
const initial = new Map();
initial.set(CardType_1.default.RED, 100);
initial.set(CardType_1.default.DOUBLE, 2);
initial.set(CardType_1.default.FREEZE, 2);
initial.set(CardType_1.default.YELLOW_MINUS1, 10);
initial.set(CardType_1.default.YELLOW_PLUS1, 10);
initial.set(CardType_1.default.RESET, 1);
const initialCardMapping = new CardMapping_1.default(initial);
exports.lockConfig = {
    intervalMinutes: 30,
    multipleGreensRequired: false,
    initial: {
        min: initialCardMapping,
        max: initialCardMapping
    },
    autoResets: {
        enabled: false
    }
};
describe('Lock', () => {
    it('sums yellow cards correctly', () => {
        const cards = new CardMapping_1.default();
        cards.setCardsOfType(CardType_1.default.YELLOW_MINUS1, 1);
        cards.setCardsOfType(CardType_1.default.YELLOW_MINUS2, 2);
        cards.setCardsOfType(CardType_1.default.YELLOW_PLUS1, 4);
        cards.setCardsOfType(CardType_1.default.YELLOW_PLUS2, 5);
        cards.setCardsOfType(CardType_1.default.YELLOW_PLUS3, 6);
        const lock = new Lock_1.default(exports.lockConfig, cards);
        expect(lock.getCards().getYellow()).toEqual(18);
    });
    it('applies the limit correctly', () => {
        const config = {
            max: {
                [CardType_1.default.RED]: 150
            }
        };
        const lock = new Lock_1.default(exports.lockConfig, initialCardMapping);
        lock.getCards().setCardsOfType(CardType_1.default.RED, 200);
        expect(lock.getCards().getRed()).toBe(200);
        // Apply limits
        lock.limit(config);
        expect(lock.getCards().getRed()).toBe(150);
    });
});
//# sourceMappingURL=Lock.test.js.map
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
const CardApplierManager_1 = __importDefault(require("./CardApplierManager"));
const Lock_1 = __importDefault(require("../model/Lock"));
const Lock_test_1 = require("../model/Lock.test");
const CardMapping_1 = __importDefault(require("../model/CardMapping"));
const CardType_1 = __importStar(require("../model/CardType"));
describe('CardApplierManager', () => {
    const applierManager = new CardApplierManager_1.default();
    it('applies red card correctly', () => {
        const lock = new Lock_1.default(Lock_test_1.lockConfig, new CardMapping_1.default(new Map()));
        lock.getCards().setCardsOfType(CardType_1.default.RED, 100);
        applierManager.apply(lock, CardType_1.default.RED);
        expect(lock.getNextDraw()).toBe(Lock_test_1.lockConfig.intervalMinutes);
        expect(lock.getCards().getRed()).toBe(99);
    });
    it('applies green card correctly', () => {
        const lock = new Lock_1.default(Lock_test_1.lockConfig, new CardMapping_1.default(new Map()));
        lock.getCards().setCardsOfType(CardType_1.default.GREEN, 10);
        applierManager.apply(lock, CardType_1.default.GREEN);
        expect(lock.getNextDraw()).toBe(0);
        expect(lock.getCards().getGreen()).toBe(9);
        expect(lock.greensDrawn).toBe(1);
    });
    it('applies yellow cards correctly', () => {
        const lock = new Lock_1.default(Lock_test_1.lockConfig, new CardMapping_1.default(new Map()));
        lock.getCards().setCardsOfType(CardType_1.default.RED, 100);
        CardType_1.ALL_YELLOWS.forEach(yellowType => {
            lock.getCards().setCardsOfType(yellowType, 2);
        });
        applierManager.apply(lock, CardType_1.default.YELLOW_PLUS1);
        expect(lock.getNextDraw()).toBe(0);
        expect(lock.getCards().getRed()).toBe(101);
        expect(lock.getCards().getYellow()).toBe(9);
        applierManager.apply(lock, CardType_1.default.YELLOW_PLUS2);
        expect(lock.getNextDraw()).toBe(0);
        expect(lock.getCards().getRed()).toBe(103);
        expect(lock.getCards().getYellow()).toBe(8);
        applierManager.apply(lock, CardType_1.default.YELLOW_PLUS3);
        expect(lock.getNextDraw()).toBe(0);
        expect(lock.getCards().getRed()).toBe(106);
        expect(lock.getCards().getYellow()).toBe(7);
        applierManager.apply(lock, CardType_1.default.YELLOW_MINUS1);
        expect(lock.getNextDraw()).toBe(0);
        expect(lock.getCards().getRed()).toBe(105);
        expect(lock.getCards().getYellow()).toBe(6);
        applierManager.apply(lock, CardType_1.default.YELLOW_MINUS2);
        expect(lock.getNextDraw()).toBe(0);
        expect(lock.getCards().getRed()).toBe(103);
        expect(lock.getCards().getYellow()).toBe(5);
    });
    it('applies reset cards correctly', () => {
        const lock = new Lock_1.default(Lock_test_1.lockConfig, new CardMapping_1.default(new Map()));
        lock.getCards().setCardsOfType(CardType_1.default.RED, 1);
        lock.getCards().setCardsOfType(CardType_1.default.GREEN, 10);
        lock.getCards().setCardsOfType(CardType_1.default.YELLOW_PLUS1, 5);
        lock.getCards().setCardsOfType(CardType_1.default.RESET, 2);
        lock.getCards().setCardsOfType(CardType_1.default.DOUBLE, 3);
        lock.greensDrawn = 5;
        applierManager.apply(lock, CardType_1.default.RESET);
        // greens, reds and yellows should be reset
        expect(lock.getCards().getRed()).toBe(Lock_test_1.lockConfig.initial.getRed());
        expect(lock.getCards().getGreen()).toBe(Lock_test_1.lockConfig.initial.getGreen());
        expect(lock.getCards().getYellow()).toBe(Lock_test_1.lockConfig.initial.getYellow());
        // one reset should have been removed
        expect(lock.getCards().getReset()).toBe(1);
        // double up should be untouched
        expect(lock.getCards().getDouble()).toBe(3);
        // greens drawn should also be reset
        expect(lock.greensDrawn).toBe(0);
    });
    it('applies sticky cards correctly', () => {
        const lock = new Lock_1.default(Lock_test_1.lockConfig, new CardMapping_1.default(new Map()));
        lock.getCards().setCardsOfType(CardType_1.default.STICKY, 20);
        applierManager.apply(lock, CardType_1.default.STICKY);
        expect(lock.getNextDraw()).toBe(Lock_test_1.lockConfig.intervalMinutes);
        expect(lock.getCards().getSticky()).toBe(20);
    });
    it('applies freeze cards correctly', () => {
        const lock = new Lock_1.default(Lock_test_1.lockConfig, new CardMapping_1.default(new Map()));
        lock.getCards().setCardsOfType(CardType_1.default.FREEZE, 20);
        applierManager.apply(lock, CardType_1.default.FREEZE);
        expect(lock.nextDraw > 2 * Lock_test_1.lockConfig.intervalMinutes && lock.nextDraw < 4 * Lock_test_1.lockConfig.intervalMinutes).toBeTruthy();
        expect(lock.getCards().getFreeze()).toBe(19);
    });
});
//# sourceMappingURL=CardApplierManager.test.js.map
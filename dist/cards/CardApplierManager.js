"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const RedCardApplier_1 = __importDefault(require("./appliers/RedCardApplier"));
const GreenCardApplier_1 = __importDefault(require("./appliers/GreenCardApplier"));
const YellowCardApplier_1 = __importDefault(require("./appliers/YellowCardApplier"));
const ResetCardApplier_1 = __importDefault(require("./appliers/ResetCardApplier"));
const StickyCardApplier_1 = __importDefault(require("./appliers/StickyCardApplier"));
const FreezeCardApplier_1 = __importDefault(require("./appliers/FreezeCardApplier"));
const DoubleCardApplier_1 = __importDefault(require("./appliers/DoubleCardApplier"));
class CardApplierManager {
    constructor(appliers) {
        if (typeof appliers !== 'undefined') {
            this.appliers = appliers;
        }
        else {
            this.appliers = [
                new GreenCardApplier_1.default(),
                new RedCardApplier_1.default(),
                new YellowCardApplier_1.default(),
                new ResetCardApplier_1.default(),
                new StickyCardApplier_1.default(),
                new FreezeCardApplier_1.default(),
                new DoubleCardApplier_1.default()
            ];
        }
    }
    apply(lock, cardType) {
        this.appliers.forEach(applier => {
            if (applier.canHandle(cardType)) {
                applier.apply(lock, cardType);
            }
        });
    }
}
exports.default = CardApplierManager;
//# sourceMappingURL=CardApplierManager.js.map
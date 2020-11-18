import CardApplier from './CardApplier';
import Lock from "../model/Lock";
import CardType from "../model/CardType";
declare class CardApplierManager {
    appliers: CardApplier[];
    constructor(appliers?: CardApplier[]);
    apply(lock: Lock, cardType: CardType): void;
}
export default CardApplierManager;

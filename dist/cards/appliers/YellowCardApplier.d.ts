import CardType from "../../model/CardType";
import Lock from "../../model/Lock";
import CardApplier from "../CardApplier";
declare class YellowCardApplier implements CardApplier {
    canHandle(type: CardType): boolean;
    /**
     * Removes or adds red cards, based on the type of yellow card.
     * @param lock the lock to modify
     */
    apply(lock: Lock, type: CardType): void;
}
export default YellowCardApplier;

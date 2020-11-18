import CardType from "../../model/CardType";
import Lock from "../../model/Lock";
import CardApplier from "../CardApplier";
declare class StickyCardApplier implements CardApplier {
    canHandle(type: CardType): boolean;
    /**
     * Does nothing but set the lock on cooldown.
     * @param lock the lock to modify
     */
    apply(lock: Lock): void;
}
export default StickyCardApplier;

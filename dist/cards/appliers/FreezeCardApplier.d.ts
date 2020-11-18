import CardType from "../../model/CardType";
import Lock from "../../model/Lock";
import CardApplier from "../CardApplier";
declare class FreezeCardApplier implements CardApplier {
    canHandle(type: CardType): boolean;
    /**
     * Freeze cards set the next draw time to between
     * 2 and 4 times the interval.
     * @param lock the lock to modify.
     */
    apply(lock: Lock): void;
}
export default FreezeCardApplier;

import CardType from "../../model/CardType";
import Lock from "../../model/Lock";
import CardApplier from "../CardApplier";
declare class ResetCardApplier implements CardApplier {
    canHandle(type: CardType): boolean;
    /**
     * Performs a soft reset on the lock.
     * @param lock the lock to modify.
     */
    apply(lock: Lock): void;
}
export default ResetCardApplier;

import CardType from "../../model/CardType";
import Lock from "../../model/Lock";
import CardApplier from "../CardApplier";
declare class RedCardApplier implements CardApplier {
    canHandle(type: CardType): boolean;
    /**
     * Removes a red card, and sets the next draw time to the current interval.
     * @param lock the lock to modify
     */
    apply(lock: Lock): void;
}
export default RedCardApplier;

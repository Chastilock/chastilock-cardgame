import CardType from "../../model/CardType";
import Lock from "../../model/Lock";
import CardApplier from "../CardApplier";
declare class GreenCardApplier implements CardApplier {
    canHandle(type: CardType): boolean;
    /**
     * Removes a green card.
     * @param lock the lock to modify
     */
    apply(lock: Lock): void;
}
export default GreenCardApplier;

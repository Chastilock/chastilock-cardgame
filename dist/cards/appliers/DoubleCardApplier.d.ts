import CardType from '../../model/CardType';
import Lock from '../../model/Lock';
import CardApplier from '../CardApplier';
declare class DoubleCardApplier implements CardApplier {
    canHandle(type: CardType): boolean;
    /**
     * Doubles all the red and yellow cards.
     * @param lock the lock to modify.
     */
    apply(lock: Lock): void;
}
export default DoubleCardApplier;

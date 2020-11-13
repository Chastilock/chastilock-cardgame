import CardType from '../../model/CardType';
import Lock from '../../model/Lock';
import CardApplier from '../CardApplier';

class GreenCardApplier implements CardApplier {
  canHandle(type: CardType): boolean {
    return type === CardType.GREEN
  }

  /**
   * Removes a green card.
   * @param lock the lock to modify
   */
  apply(lock: Lock): void {
    // Amount of green cards is reduced by 1
    lock.getCards().setCardsOfType(CardType.GREEN, lock.getCards().getGreen() - 1);

    lock.greensDrawn = lock.greensDrawn + 1;
  }
}

export default GreenCardApplier;
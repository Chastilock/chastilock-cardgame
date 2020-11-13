import CardType from '../../model/CardType';
import Lock from '../../model/Lock';
import CardApplier from '../CardApplier';

class RedCardApplier implements CardApplier {
  canHandle(type: CardType): boolean {
    return type === CardType.RED
  }

  /**
   * Removes a red card, and sets the next draw time to the current interval.
   * @param lock the lock to modify
   */
  apply(lock: Lock): void {
    // Amount of red cards is reduced by 1
    lock.getCards().setCardsOfType(CardType.RED, lock.getCards().getRed() - 1);

    // Next draw time is set
    lock.doRegularCooldown();
  }
}

export default RedCardApplier;
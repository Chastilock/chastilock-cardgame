import CardType, { ALL_YELLOWS } from '../../model/CardType'
import Lock from '../../model/Lock'
import CardApplier from '../CardApplier'

class DoubleCardApplier implements CardApplier {
  canHandle (type: CardType): boolean {
    return type === CardType.DOUBLE
  }

  /**
   * Doubles all the red and yellow cards.
   * @param lock the lock to modify.
   */
  apply (lock: Lock): void {
    lock.getCards().setCardsOfType(CardType.RED, lock.getCards().getRed() * 2)

    ALL_YELLOWS.forEach(yellowType => {
      lock.getCards().setCardsOfType(yellowType, lock.getCards().getCardsOfType(yellowType) * 2)
    })

    lock.getCards().setCardsOfType(CardType.DOUBLE, lock.getCards().getDouble() - 1)
  }
}

export default DoubleCardApplier

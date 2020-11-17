import CardType from 'model/CardType'
import Lock from 'model/Lock'
import CardApplier from 'cards/CardApplier'

class ResetCardApplier implements CardApplier {
  canHandle (type: CardType): boolean {
    return type === CardType.RESET
  }

  /**
   * Performs a soft reset on the lock.
   * @param lock the lock to modify.
   */
  apply (lock: Lock): void {
    lock.resetSoft()

    lock.getCards().setCardsOfType(CardType.RESET, lock.getCards().getReset() - 1)
  }
}

export default ResetCardApplier

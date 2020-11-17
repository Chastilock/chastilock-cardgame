import CardType from 'model/CardType'
import Lock from 'model/Lock'
import { lockConfig } from 'model/Lock.test'
import CardApplier from 'cards/CardApplier'

class FreezeCardApplier implements CardApplier {
  canHandle (type: CardType): boolean {
    return type === CardType.FREEZE
  }

  /**
   * Freeze cards set the next draw time to between
   * 2 and 4 times the interval.
   * @param lock the lock to modify.
   */
  apply (lock: Lock): void {
    lock.resetSoft()

    const multiplier = 2 + Math.random() * 2

    lock.nextDraw = lockConfig.interval * multiplier
    lock.getCards().setCardsOfType(CardType.FREEZE, lock.getCards().getFreeze() - 1)
  }
}

export default FreezeCardApplier

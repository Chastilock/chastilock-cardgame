import CardType from 'model/CardType'
import Lock from 'model/Lock'
import CardApplier from 'cards/CardApplier'
import Freeze, { FreezeType } from 'model/Freeze'

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
    const multiplier = 2 + Math.random() * 2

    const cardFreeze: Freeze = {
      source: FreezeType.CARD,
      startTime: lock.elapsedMinutes,
      endTime: lock.elapsedMinutes + multiplier * lock.config.intervalMinutes
    }
    lock.freeze = cardFreeze

    lock.nextDraw = lock.config.intervalMinutes * multiplier
    lock.getCards().setCardsOfType(CardType.FREEZE, lock.getCards().getFreeze() - 1)
    lock.chances--
  }
}

export default FreezeCardApplier

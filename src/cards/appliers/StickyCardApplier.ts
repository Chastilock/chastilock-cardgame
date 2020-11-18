import CardType from 'model/CardType'
import Lock from 'model/Lock'
import CardApplier from 'cards/CardApplier'

class StickyCardApplier implements CardApplier {
  canHandle (type: CardType): boolean {
    return type === CardType.STICKY
  }

  /**
   * Does nothing but set the lock on cooldown.
   * @param lock the lock to modify
   */
  apply (lock: Lock): void {
    // Next draw time is set
    lock.doRegularCooldown()
  }
}

export default StickyCardApplier

import CardType from '../model/CardType'
import Lock from '../model/Lock'

interface CardApplier {
  /**
   * Should return whether or not this applier should be
   * run for the given card type.
   * @param type the type that needs to be applied
   */
  canHandle: (type: CardType) => boolean

  /**
   * Applies this card to a certain lock. It does not modify
   * the supplied lock, but instead create a new copy that is
   * containing the new state, that is being returned.
   * @param lock the lock to apply to
   * @param type the type of card that is being processed
   */
  apply: (lock: Lock, type: CardType) => void
}

export default CardApplier

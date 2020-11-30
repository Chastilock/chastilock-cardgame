import CardType, { isYellowCard } from 'model/CardType'
import Lock from 'model/Lock'
import CardApplier from 'cards/CardApplier'

const mapping = {
  [CardType.YELLOW_PLUS1.toString()]: 1,
  [CardType.YELLOW_PLUS2.toString()]: 2,
  [CardType.YELLOW_PLUS3.toString()]: 3,
  [CardType.YELLOW_MINUS1.toString()]: -1,
  [CardType.YELLOW_MINUS2.toString()]: -2
}

class YellowCardApplier implements CardApplier {
  canHandle (type: CardType): boolean {
    return isYellowCard(type)
  }

  /**
   * Removes or adds red cards, based on the type of yellow card.
   * @param lock the lock to modify
   */
  apply (lock: Lock, type: CardType): void {
    const difference = mapping[type.toString()]

    lock.getCards().setCardsOfType(CardType.RED, lock.getCards().getRed() + difference)
    lock.getCards().setCardsOfType(type, lock.getCards().getCardsOfType(type) - 1)
  }
}

export default YellowCardApplier

import CardMapping from './CardMapping'
import CardType, { ALL_YELLOWS, ALL_CARDS } from './CardType'
import LockConfig from './LockConfig'

class Lock {
  public cards: CardMapping
  public nextDraw = 0
  public config: LockConfig
  public greensDrawn = 0

  constructor (config: LockConfig, cards?: CardMapping) {
    this.config = config

    if (cards !== undefined) {
      this.cards = cards
    } else {
      this.cards = this.createCards()
    }
  }

  /**
   * Sets up the lock after first initialization. Performs the random logic
   * to define how many cards of what type are being used.
   *
   * May also be called when resetting.
   * @returns the initial CardMapping
   */
  public createCards (): CardMapping {
    const cardMapping = new CardMapping()

    const getCardAmount = (min: number, max: number): number =>
      Math.floor(Math.random() * (max - min + 1)) + min

    ALL_CARDS.forEach(cardType =>
      cardMapping.setCardsOfType(
        cardType,
        getCardAmount(
          this.getConfig().initial.min.getCardsOfType(cardType),
          this.getConfig().initial.max.getCardsOfType(cardType)
        )
      )
    )

    return cardMapping
  }

  /**
   * Sets draw time to current interval.
   */
  public doRegularCooldown (): void {
    this.nextDraw = this.getConfig().intervalMinutes
  }

  /**
   * Completely resets the lock to it's initial state.
   *
   * Also known as keyholder-reset.
   */
  public resetHard (): void {
    this.cards = this.createCards()

    this.greensDrawn = 0
  }

  /**
   * Resets the number of green, red and yellow cards.
   *
   * Also known as reset-card reset.
   */
  public resetSoft (): void {
    // We'll only be using the red, green and yellow cards out of this.
    const completelyNewCards = this.createCards()

    this.greensDrawn = 0

    const relevantCardTypes = [CardType.GREEN, CardType.RED, ...ALL_YELLOWS]
    relevantCardTypes.forEach(cardType =>
      this.getCards().setCardsOfType(cardType, completelyNewCards.getCardsOfType(cardType)))
  }

  public getNextDraw (): number {
    return this.nextDraw
  }

  public getConfig (): LockConfig {
    return this.config
  }

  public getCards (): CardMapping {
    return this.cards
  }
}

export default Lock

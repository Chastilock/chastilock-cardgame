import CardMapping from './CardMapping'
import CardType, { ALL_YELLOWS, ALL_CARDS } from './CardType'
import Config from './Config'
import LockConfig from './LockConfig'

class Lock {
  public cards: CardMapping
  public config: LockConfig

  public elapsedMinutes: number = 0 // minutes since the start of the lock
  public nextDraw = 0 // time of next draw in terms of minutes since start of lock
  public chances = 0 // the number of chances accumulated
  public greensDrawn = 0
  public minutesBeforeGreenAllowed: number // the number of minutes before a green is allowed to be drawn

  constructor (config: LockConfig, cards?: CardMapping) {
    this.config = config

    if (cards !== undefined) {
      this.cards = cards
    } else {
      this.cards = this.createCards()
    }

    // code to determine when greens may first be drawn
    // currently CK avoids drawing green on first draw and possibly
    // for longer based on minimum red cards.
    // https://discord.com/channels/473856867768991744/491277623322738712/828043778379481149
    // http://chastikey.com/help/doku.php?id=minimum_lock_durations
    const minReds = config.initial.min.getRed()
    if (minReds > 1 && minReds !== config.initial.max.getRed()) {
      this.minutesBeforeGreenAllowed = minReds * config.intervalMinutes
    } else {
      this.minutesBeforeGreenAllowed = config.intervalMinutes
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
   * Draws a card.  Also enforces rules about drawing a Green card
   */
  public drawCard (): CardType {
    let card = this.getCards().drawRandomType()
    // draw again if 3 things are true
    // Note: There is a possible issue here with indefinite postponement if the deck is made up of
    // predominantly green cards, as in 100 greens and 1 red.   Many draws might be required to find
    // the one legal red card.  This could be fixed by adding a method to CardMapping that would draw
    // a non-green card.
    while (card === CardType.GREEN && // card is green
      this.elapsedMinutes < this.minutesBeforeGreenAllowed && // too early for green
      this.getCards().getGreen() !== this.getCards().getTotalCards()) { // there are still non-green cards to draw
      card = this.getCards().drawRandomType()
    }
    return card
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

  /**
   * Limits the lock to the configured maximum of cards
   * @param config the config to respect
   */
  public limit (config: Config): void {
    this.getCards().map.forEach((value, key) => {
      const maxCards = config.max[key]

      if (maxCards !== 0 && maxCards !== undefined) {
        // apply the limit
        if (value > maxCards) {
          this.getCards().setCardsOfType(key, maxCards)
        }
      }
    })
  }

  public isFinished (): boolean {
    if (this.getConfig().multipleGreensRequired) {
      return this.greensDrawn !== 0 && this.getCards().getGreen() === 0
    } else {
      return this.greensDrawn >= 1
    }
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

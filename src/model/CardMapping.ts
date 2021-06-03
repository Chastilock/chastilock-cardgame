import CardType, { isYellowCard } from './CardType'

class CardMapping {
  public map: Map<CardType, number>

  constructor (map?: Map<CardType, number>) {
    if (map !== undefined) {
      this.map = map
    } else {
      this.map = new Map()
    }
  }

  public getCardsOfType (type: CardType): number {
    return this.map.get(type) ?? 0
  }

  public setCardsOfType (type: CardType, cards: number): void {
    this.map.set(type, cards)
  }

  /**
   * Draws a random card type of this set.
   */
  public drawRandomType (): CardType {
    const totalCards = this.getTotalCards()

    let accumulator = 0
    const chances = Array.from(this.map.values()).map((element: number) => (accumulator = accumulator + element))
    const drawnIndex = Math.random() * totalCards
    const drawnCard = Array.from(this.map.keys())[chances.filter(element => element <= drawnIndex).length]

    return drawnCard
  }

  /**
   * Get total cards in this mapping
   */
  public getTotalCards (): number {
    return Array.from(this.map.values()).reduce((prev: number, cur: number) => prev + cur, 0)
  }

  public getGreen (): number {
    return this.getCardsOfType(CardType.GREEN)
  }

  public getRed (): number {
    return this.getCardsOfType(CardType.RED)
  }

  public getSticky (): number {
    return this.getCardsOfType(CardType.STICKY)
  }

  public getFreeze (): number {
    return this.getCardsOfType(CardType.FREEZE)
  }

  public getDouble (): number {
    return this.getCardsOfType(CardType.DOUBLE)
  }

  public getReset (): number {
    return this.getCardsOfType(CardType.RESET)
  }

  public getGoAgain (): number {
    return this.getCardsOfType(CardType.GO_AGAIN)
  }

  public getYellow (): number {
    let yellow = 0

    this.map.forEach((value: number, key: CardType) => {
      if (isYellowCard(key)) {
        yellow = yellow + value
      }
    })

    return yellow
  }

  /**
   * Creates and returns a new CardMapping with a reference to
   * a new map containing the same data as this CardMapping
   */
  public copyDeep (): CardMapping {
    const clone = new CardMapping()
    this.map.forEach((value: number, key: CardType) => {
      clone.setCardsOfType(key, value)
    })
    return clone
  }
}

export default CardMapping

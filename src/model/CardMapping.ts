import CardType, { isYellowCard } from './CardType'

class CardMapping {
  public map: Map<CardType, number>

  constructor (map: Map<CardType, number>) {
    this.map = map
  }

  public getCardsOfType (type: CardType): number {
    return this.map.get(type) ?? 0
  }

  public setCardsOfType (type: CardType, cards: number): void {
    this.map.set(type, cards)
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

  public getYellow (): number {
    let yellow = 0

    this.map.forEach((value: number, key: CardType) => {
      if (isYellowCard(key)) {
        yellow = yellow + value
      }
    })

    return yellow
  }
}

export default CardMapping

import CardType, { isYellowCard } from './CardType';

export type CardMapping = Map<CardType, number>;

class Lock {
  private cards: CardMapping;

  constructor(cards: CardMapping) {
    this.cards = cards;
  }

  public getCardsOfType(type: CardType): number {
    return this.cards.get(type) || 0;
  }

  public getRed(): number {
    return this.getCardsOfType(CardType.RED);
  }

  public getSticky(): number {
    return this.getCardsOfType(CardType.STICKY);
  }

  public getFreeze(): number {
    return this.getCardsOfType(CardType.FREEZE)
  }

  public getDouble(): number {
    return this.getCardsOfType(CardType.DOUBLE)
  }

  public getReset(): number {
    return this.getCardsOfType(CardType.RESET)
  }

  public getYellow(): number {
    let yellow = 0;

    this.cards.forEach((value: number, key: CardType) => {
      if (isYellowCard(key)) {
        yellow = yellow + value;
      }
    });

    return yellow;
  }
}

export default Lock;
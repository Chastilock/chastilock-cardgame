import Lock, { CardMapping } from './Lock';
import CardType from './CardType';

describe('Lock', () => {
  it('sums yellow cards correctly', () => {
    const cards: CardMapping = new Map();
    cards.set(CardType.YELLOW_MINUS1, 1);
    cards.set(CardType.YELLOW_MINUS2, 2);
    cards.set(CardType.YELLOW_MINUS3, 3);
    cards.set(CardType.YELLOW_PLUS1, 4);
    cards.set(CardType.YELLOW_PLUS2, 5);
    cards.set(CardType.YELLOW_PLUS3, 6);

    const lock = new Lock(cards);

    expect(lock.getYellow()).toEqual(21);
  });
});
import Lock from './Lock';
import CardMapping from './CardMapping';
import CardType from './CardType';
import LockConfig from './LockConfig';

const initial = new Map();
initial.set(CardType.RED, 100);
initial.set(CardType.DOUBLE, 2);
initial.set(CardType.FREEZE, 2);
initial.set(CardType.YELLOW_MINUS1, 10);
initial.set(CardType.YELLOW_PLUS1, 10);
initial.set(CardType.RESET, 1);

export const lockConfig: LockConfig = {
  interval: 30000,
  multipleGreensRequired: false,
  initial: new CardMapping(initial),
  autoResets: {
    enabled: false
  }
}

describe('Lock', () => {
  it('sums yellow cards correctly', () => {
    const cards: CardMapping = new CardMapping(new Map());
    cards.setCardsOfType(CardType.YELLOW_MINUS1, 1);
    cards.setCardsOfType(CardType.YELLOW_MINUS2, 2);
    cards.setCardsOfType(CardType.YELLOW_MINUS3, 3);
    cards.setCardsOfType(CardType.YELLOW_PLUS1, 4);
    cards.setCardsOfType(CardType.YELLOW_PLUS2, 5);
    cards.setCardsOfType(CardType.YELLOW_PLUS3, 6);

    const lock = new Lock(lockConfig, cards);

    expect(lock.getCards().getYellow()).toEqual(21);
  });
});
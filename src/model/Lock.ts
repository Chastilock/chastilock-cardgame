import CardMapping from './CardMapping';
import CardType, { ALL_YELLOWS } from './CardType';
import LockConfig from './LockConfig';

class Lock {
  public cards: CardMapping;
  public nextDraw = 0;
  public config: LockConfig;
  public greensDrawn = 0;

  constructor(config: LockConfig, cards: CardMapping) {
    this.config = config;
    this.cards = cards;
  }

  /**
   * Sets draw time to current interval.
   */
  public doRegularCooldown(): void {
    this.nextDraw = this.getConfig().interval;
  }

  /**
   * Completely resets the lock to it's initial state.
   * 
   * Also known as keyholder-reset.
   */
  public resetHard(): void {
    const newMap = Object.assign({}, this.getConfig().initial.map);
    this.cards.map = newMap;

    this.greensDrawn = 0;
  }

  /**
   * Resets the number of green, red and yellow cards.
   * 
   * Also known as reset-card reset.
   */
  public resetSoft(): void {
    this.greensDrawn = 0;

    this.getCards().setCardsOfType(CardType.GREEN, this.getConfig().initial.getGreen());
    this.getCards().setCardsOfType(CardType.RED, this.getConfig().initial.getRed());

    // reset yellow cards
    ALL_YELLOWS.forEach((yellowType: CardType) => {
      this.getCards().setCardsOfType(yellowType, this.getConfig().initial.getCardsOfType(yellowType));
    });
  }

  public getNextDraw(): number {
    return this.nextDraw;
  }

  public getConfig(): LockConfig {
    return this.config;
  }

  public getCards(): CardMapping {
    return this.cards;
  }

}

export default Lock;
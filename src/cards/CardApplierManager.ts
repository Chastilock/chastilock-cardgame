import CardApplier from './CardApplier';
import Lock from '../model/Lock';
import CardType from '../model/CardType';

import RedCardApplier from './appliers/RedCardApplier';
import GreenCardApplier from './appliers/GreenCardApplier';
import YellowCardApplier from './appliers/YellowCardApplier';
import ResetCardApplier from './appliers/ResetCardApplier';
import StickyCardApplier from './appliers/StickyCardApplier';
import FreezeCardApplier from './appliers/FreezeCardApplier';
import DoubleCardApplier from './appliers/DoubleCardApplier';

class CardApplierManager {
  appliers: CardApplier[];

  constructor(appliers?: CardApplier[]) {
    if (typeof appliers !== 'undefined') {
      this.appliers = appliers;
    } else {
      this.appliers = [
        new GreenCardApplier(),
        new RedCardApplier(),
        new YellowCardApplier(),
        new ResetCardApplier(),
        new StickyCardApplier(),
        new FreezeCardApplier(),
        new DoubleCardApplier(),
      ]
    }
  }

  public apply(lock: Lock, cardType: CardType): void {
    this.appliers.forEach(applier => {
      if (applier.canHandle(cardType)) {
        applier.apply(lock, cardType);
      }
    });
  }
}

export default CardApplierManager;
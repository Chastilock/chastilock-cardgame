import CardType from 'model/CardType'
import Config from 'model/Config'
import Lock from 'model/Lock'
import CardApplierManager from 'cards/CardApplierManager'

class ChastilockGame {
  public config: Config // the configuration of maximum cards, used to limit the lock
  public lock: Lock // the lock also has a config which contains info about the min/max cards specified when lock created
  public manager: CardApplierManager = new CardApplierManager()

  constructor (config: Config, lock: Lock) {
    this.config = config
    this.lock = lock
  }

  drawCard (): CardType {
    const drawn = this.lock.drawCard()

    // Apply the effects
    this.manager.apply(this.lock, drawn)

    // Limit the lock (to the configured max)
    this.lock.limit(this.config)

    return drawn
  }
}

export default ChastilockGame

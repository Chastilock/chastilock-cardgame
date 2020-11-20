import CardType from 'model/CardType'
import Config from 'model/Config'
import Lock from 'model/Lock'
import CardApplierManager from 'cards/CardApplierManager'

class ChastilockGame {
  public config: Config
  public lock: Lock
  public manager: CardApplierManager = new CardApplierManager()

  constructor (config: Config, lock: Lock) {
    this.config = config
    this.lock = lock
  }

  drawCard (): CardType {
    const drawn = this.lock.getCards().drawRandomType()

    // Apply the effects
    this.manager.apply(this.lock, drawn)

    // Limit the lock (to the configured max)
    this.lock.limit(this.config)

    return drawn
  }
}

export default ChastilockGame

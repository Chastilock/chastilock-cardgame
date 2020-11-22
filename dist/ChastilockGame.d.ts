import CardType from "./model/CardType";
import Config from "./model/Config";
import Lock from "./model/Lock";
import CardApplierManager from "./cards/CardApplierManager";
declare class ChastilockGame {
    config: Config;
    lock: Lock;
    manager: CardApplierManager;
    constructor(config: Config, lock: Lock);
    drawCard(): CardType;
}
export default ChastilockGame;

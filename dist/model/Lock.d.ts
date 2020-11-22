import CardMapping from './CardMapping';
import Config from './Config';
import LockConfig from './LockConfig';
declare class Lock {
    cards: CardMapping;
    nextDraw: number;
    config: LockConfig;
    greensDrawn: number;
    constructor(config: LockConfig, cards?: CardMapping);
    /**
     * Sets up the lock after first initialization. Performs the random logic
     * to define how many cards of what type are being used.
     *
     * May also be called when resetting.
     * @returns the initial CardMapping
     */
    createCards(): CardMapping;
    /**
     * Sets draw time to current interval.
     */
    doRegularCooldown(): void;
    /**
     * Completely resets the lock to it's initial state.
     *
     * Also known as keyholder-reset.
     */
    resetHard(): void;
    /**
     * Resets the number of green, red and yellow cards.
     *
     * Also known as reset-card reset.
     */
    resetSoft(): void;
    /**
     * Limits the lock to the configured maximum of cards
     * @param config the config to respect
     */
    limit(config: Config): void;
    isFinished(): boolean;
    getNextDraw(): number;
    getConfig(): LockConfig;
    getCards(): CardMapping;
}
export default Lock;

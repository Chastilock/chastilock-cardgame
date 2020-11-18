import CardMapping from './CardMapping';
import LockConfig from './LockConfig';
declare class Lock {
    cards: CardMapping;
    nextDraw: number;
    config: LockConfig;
    greensDrawn: number;
    constructor(config: LockConfig, cards: CardMapping);
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
    getNextDraw(): number;
    getConfig(): LockConfig;
    getCards(): CardMapping;
}
export default Lock;

import CardType from './CardType';
declare class CardMapping {
    map: Map<CardType, number>;
    constructor(map?: Map<CardType, number>);
    getCardsOfType(type: CardType): number;
    setCardsOfType(type: CardType, cards: number): void;
    /**
     * Draws a random card type of this set.
     */
    drawRandomType(): CardType;
    /**
     * Get total cards in this mapping
     */
    getTotalCards(): number;
    getGreen(): number;
    getRed(): number;
    getSticky(): number;
    getFreeze(): number;
    getDouble(): number;
    getReset(): number;
    getYellow(): number;
}
export default CardMapping;

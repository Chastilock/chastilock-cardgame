import CardType from './CardType';
declare class CardMapping {
    map: Map<CardType, number>;
    constructor(map?: Map<CardType, number>);
    getCardsOfType(type: CardType): number;
    setCardsOfType(type: CardType, cards: number): void;
    getGreen(): number;
    getRed(): number;
    getSticky(): number;
    getFreeze(): number;
    getDouble(): number;
    getReset(): number;
    getYellow(): number;
}
export default CardMapping;

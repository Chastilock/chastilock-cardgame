import CardType from './CardType';
interface Config {
    max: {
        [key in CardType]?: number;
    };
}
export default Config;

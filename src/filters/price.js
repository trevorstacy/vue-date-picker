import { number } from "./number";

/**
 * Rounds and formats the number to X decimal places
 *
 * @param {Number} value
 * @param {String} delimiter
 * @param {Number} decimalCount
 * @param {Boolean} round
 * @return {String}
 */
export const price = (value, delimiter = ',', decimalCount = 2, round = true) => {
    return number(value, decimalCount, delimiter, round) + ' €';
};

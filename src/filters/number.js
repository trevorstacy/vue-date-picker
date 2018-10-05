/**
 * Rounds and formats the number to X decimal places
 *
 * @param {Number} value
 * @param {Number} decimalCount
 * @param {String} delimiter
 * @param {Boolean} round
 * @return {String}
 */
export const number = (value, decimalCount = 2, delimiter = ',', round = true) => {
    if (round) {
        const divisor = Math.pow(10, decimalCount);
        value = Math.round(value * divisor) / divisor;
    }
    return value.toFixed(decimalCount).replace('.', delimiter);
};

/**
 * https://lodash.com/docs/4.17.4#slice
 */
export const slice = (array, start, end) => {
    let length = array == null ? 0 : array.length;
    if (!length) {
        return [];
    }

    start = start == null ? 0 : start;
    end = end === undefined ? length : end;
    if (start < 0) {
        start = -start > length ? 0 : (length + start);
    }

    end = end > length ? length : end;
    if (end < 0) {
        end += length;
    }

    length = start > end ? 0 : ((end - start) >>> 0);
    start >>>= 0;

    let index = -1;
    const result = new Array(length);

    while (++index < length) {
        result[index] = array[index + start];
    }

    return result;
};

/**
 * https://lodash.com/docs/4.17.4#chunk
 */
export const chunk = (array, size) => {
    size = Math.max(size, 0);

    const length = array == null ? 0 : array.length;
    if (!length || size < 1) {
        return [];
    }

    let index = 0;
    let resIndex = 0;
    const result = new Array(Math.ceil(length / size));
    while (index < length) {
        result[resIndex++] = slice(array, index, (index += size));
    }

    return result;
};

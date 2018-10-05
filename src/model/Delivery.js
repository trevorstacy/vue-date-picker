import Moment       from "moment";

export const DELIVERY_MODES = {
    MODE_DAY: 'day',
    MODE_WEEK: 'week',
    MODE_MONTH: 'month',
    MODE_HOUR: 'hour'
};

export const MODE_FORMATS = {
    MODE_DAY: 'YYYY-MM-DD',
    MODE_WEEK: 'YYYY-WW',
    MODE_MONTH: 'YYYY-MM',
    MODE_HOUR: 'HH:mm'
};

export default class Delivery {

    constructor(data, mode = DELIVERY_MODES.MODE_DAY) {
        const format    = MODE_FORMATS[Object.keys(DELIVERY_MODES).find(key => DELIVERY_MODES[key] === mode)];
        this.date       = new Moment(data['date'], format, 'sk');
        this.avgTime    = data['avgTime'];
        this.mode       = mode;
    }

    getDate() {
        return this.date;
    }

    getAvgTime() {
        return this.avgTime;
    }

    getFrom() {
        return this.date.startOf(this.mode);
    }

    getTo() {
        return this.date.endOf(this.mode);
    }

}
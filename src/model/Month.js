import Moment   from "moment";
import { monthTranslations } from "../data/translations";

// Date's settings
const now           = Moment();
const currentYear   = +now.format('YYYY');
const currentMonth  = +now.format("M");

export default class Month {

    /**
     * @param {number} month
     */
    constructor(month) {
        this.name       = monthTranslations[month - 1] || "";
        this.year       = month > currentMonth ? currentYear - 1 : currentYear;
        this.active     = false;
        this.numeric    = month;
    }

    /**
     * Returns the name of the month
     *
     * @return {string}
     */
    getName() {
        return this.name;
    }


    /**
     * Returns the short name of the month
     *
     * @return {string}
     */
    getShortName() {
        if (!this.shortName) {
            this.shortName = this.name.substring(0, 3);
        }
        return this.shortName;
    }


    /**
     * Returns the year in which month is presented
     *
     * @return {number}
     */
    getYear() {
        return +this.year;
    }



    /**
     * Returns the title of the month
     *
     * @return {string}
     */
    getTitle() {
        return this.getName() + " " + this.getYear();
    }

    /**
     * Returns the numeric representation of the month
     *
     * @return {number}
     */
    getNumeric() {
        return +this.numeric;
    };

    /**
     * Returns whether the month is active or not
     *
     * @return {boolean}
     */
    isActive() {
        return !!this.active;
    }

    /**
     * Sets the active state of the month
     *
     * @return {number}
     */
    setActiveState(isActive) {
        this.active = isActive;
    };

}

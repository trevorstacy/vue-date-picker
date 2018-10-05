import { dayTranslations }  from "../data/translations";

export default class Day {

    /**
     * @param {number} day
     */
    constructor(day) {
        this.name       = dayTranslations[day - 1] || "";
        this.active     = false;
        this.numeric    = day;
    }

    /**
     * Returns the name of the day
     *
     * @return {string}
     */
    getName() {
        return this.name;
    }


    /**
     * Returns the short name of the day
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
     * Returns the numeric representation of the day
     *
     * @return {number}
     */
    getNumeric() {
        return +this.numeric;
    };

    /**
     * Returns whether the day is active or not
     *
     * @return {boolean}
     */
    isActive() {
        return !!this.active;
    }

    /**
     * Sets the active state of the day
     *
     * @return {number}
     */
    setActive(isActive) {
        this.active = isActive;
    };

}

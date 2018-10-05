import Moment from "moment";

export const GRADE_TYPES = {
    WORST: 1,
    WORSE: 2,
    MEDIUM: 3,
    BETTER: 4,
    BEST: 5
};

export default class Rating {

    constructor(ratingData) {
        this.id = +ratingData.idRating;
        this.compensation = !!ratingData.compensation;
        this.content = ratingData.content + "";
        this.customerName = ratingData.customerName + "";
        this.dateAdd = Moment(ratingData.dateAdd, 'YYYY-MM-DD');
        this.grade = +ratingData.grade;
        this.phone = ratingData.phone + "";
    }

    setCompensation(isCompensated) {
        this.compensation = !!isCompensated;
        return this;
    }

    getId() {
        return this.id;
    }

    isCompensated() {
        return this.compensation;
    }

    getContent() {
        return this.content;
    }

    getCustomerName() {
        return this.customerName;
    }

    getDateAdd(format = "") {
        return !format ? this.dateAdd : this.dateAdd.format(format);
    }

    getGrade() {
        return this.grade;
    }

    getPhone() {
        return this.phone;
    }

}

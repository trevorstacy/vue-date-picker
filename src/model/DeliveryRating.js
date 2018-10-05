import { deliveryRatingTranslations } from "../data/translations";

export default class DeliveryRating {

    constructor(data) {
        this.name   = data.name;
        this.value  = data.value;
    }

    getName() {
        return this.name;
    }

    getValue() {
        return this.value;
    }

    getTranslatedName() {
        if (!deliveryRatingTranslations[this.name]) {
            return '';
        }
        return deliveryRatingTranslations[this.name];
    }

}
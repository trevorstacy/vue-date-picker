import Month from "../model/Month";
import Moment from "moment";
import TemplateParsingService from "./TemplateParsingService";
import Restaurant from "../model/Restaurant";

class FiltersService {


    generateMonthObjects() {
        // Creates Array[1, 2, ..., 12] -> then coverts to Month objects
        let months = Array.from(new Array(12), (v, i) => i + 1).map(month => new Month(month));

        // Months which numeric value is greater than currentMonth are put before the current month
        return [...months.splice(+Moment().format("M")), ...months];
    }

    preloadRestaurantsFromTemplate() {
        const restaurants = TemplateParsingService.parse('restaurants');
        return restaurants ? restaurants.map(restaurant => new Restaurant(restaurant)) : [];
    }

}

export default new FiltersService();

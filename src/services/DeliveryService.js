import axios                        from "axios";
import Router                       from "../external/backend-routes";
import CustomFilter                 from "../model/CustomFilter";
import DeliveryRating               from "../model/DeliveryRating";
import { ADD_CUSTOM_FILTER          } from "../store/lists/mutations";
import TemplateParsingService       from "./TemplateParsingService";
import Delivery, { DELIVERY_MODES } from "../model/Delivery";
import DeliveryModeFilterComponent  from "../components/content/filters/DeliveryModeFilter";

function mapDataToObjects(data = [], mode) {
    const deliveries = data.deliveries.map(item => new Delivery(item, mode));
    let ratings = [];
    for (const ratingType in data.ratings) {
        if (data.ratings.hasOwnProperty(ratingType)) {
            ratings.push(new DeliveryRating({ name: ratingType, value: data.ratings[ratingType] }))
        }
    }
    return { deliveries, ratings };
}

class DeliveryService {

    constructor() {
        this.router         = Router;
        this.templateParser = TemplateParsingService;
    }

    async getData(params) {
        const url      = this.router.get('api_get_deliveries', params);
        const { data } = await axios.get(url);
        return mapDataToObjects(data, params.mode);
    }

    getDeliveriesFromTemplate(mode) {
        const data = this.templateParser.parse('deliveries');
        return !data ? { deliveries: [], ratings: [] } : mapDataToObjects(data, mode);
    }

    addCustomFiltersToStore(scope) {
        scope.$store.commit(ADD_CUSTOM_FILTER, new CustomFilter({
            id: 'DeliveryModeFilter',
            component: DeliveryModeFilterComponent,
            callback: value => {
                scope.mode = Object.values(DELIVERY_MODES).includes(value)
                    ? value
                    : DELIVERY_MODES.MODE_DAY;
            },
            options: { resettable: false }
        }))
    }
}

export default new DeliveryService();
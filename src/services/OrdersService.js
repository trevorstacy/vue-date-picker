import axios                        from "axios/index";
import Order                        from "../model/Order";
import Router                       from "../external/backend-routes";
import CustomFilter                 from "../model/CustomFilter";
import { ADD_CUSTOM_FILTER          } from "../store/lists/mutations";
import TemplateParsingService       from "./TemplateParsingService";
import PaymentTypeFilterComponent  from "../components/content/filters/PaymentTypeFilter";
import CurrentStateFilterComponent  from "../components/content/filters/CurrentStateFilter";

class OrdersService {

    constructor () {
        this.router = Router;
        this.templateParser = TemplateParsingService;
    }

    /**
     * Get orders based on passed filters object
     *
     * @param {Object} filters
     * @return {Object}
     */
    async getOrders(filters) {
        const url = this.router.get('api_get_orders', filters);
        let { data: { orders, information } } = await axios.get(url);
        orders = orders.map(order => new Order(order));
        return { orders, information };
    }

    getOrdersFromTemplate() {
        const orders = this.templateParser.parse('orders');
        return orders ? orders.map(order => new Order(order)) : [];
    }

    getOrdersInformationFromTemplate() {
        const ordersInformation = this.templateParser.parse('orders-information');
        return ordersInformation ? ordersInformation : {
            pageCount: 0,
            priceTotal: 0,
            acceptedTotal: 0,
            countTotal: 0
        };
    }

    addCustomFiltersToStore(scope) {
        scope.$store.commit(ADD_CUSTOM_FILTER, new CustomFilter({
            id: 'CurrentStateFilter',
            component: CurrentStateFilterComponent,
            callback: value => {
                scope.currentState = value && value > 0 ? +value : 0;
                scope.getOrders();
            }
        }));
        scope.$store.commit(ADD_CUSTOM_FILTER, new CustomFilter({
            id: 'PaymentMethodFilter',
            component: PaymentTypeFilterComponent,
            callback: value => {
                scope.paymentMethod = value && value > 0 ? +value : 0;
                scope.getOrders();
            }
        }));
    }

}

export default new OrdersService();

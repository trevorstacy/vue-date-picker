import axios from "axios";
import UrlBuilderService from "@/services/UrlBuilderService";
import Restaurant from "@/model/Restaurant";
import {URL_REGIONAL_MANAGER, URL_RESTAURANTS} from "@/data/api-routes";

class CustomerService {

    async getRestaurants() {
        const url = UrlBuilderService.get(URL_RESTAURANTS);
        const { data } = await axios.get(url);
        return data.map(restaurantData => new Restaurant(restaurantData));
    }

    async getRegionalManager() {
        const url = UrlBuilderService.get(URL_REGIONAL_MANAGER);
        const { data } = await axios.get(url);
        return data;
    }

}

export default new CustomerService();

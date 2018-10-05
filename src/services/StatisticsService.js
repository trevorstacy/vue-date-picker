import axios                    from "axios";
import Router                   from "../external/backend-routes";
import TemplateParsingService   from "./TemplateParsingService";
import BestsellerProduct        from "../model/BestsellerProduct";

class StatisticsService {

    constructor() {
        this.router = Router;
    }

    getBestsellersFromTemplate() {
        const bestsellers = TemplateParsingService.parse('bestsellers');
        return bestsellers ? bestsellers.map(bestseller => new BestsellerProduct(bestseller)) : [];
    }

    /**
     * Get ratings based on passed filters object
     *
     * @param {Object} filters
     * @return {BestsellerProduct[]}
     */
    async getBestsellers(filters) {
        const url = this.router.get('api_get_bestsellers', filters);
        let { data: bestsellers } = await axios.get(url);
        return bestsellers.map(bestseller => new BestsellerProduct(bestseller));
    }

}

export default new StatisticsService();

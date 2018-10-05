import axios                    from "axios";
import Router                   from "../external/backend-routes";
import Rating                   from "../model/Rating";
import CustomFilter             from "../model/CustomFilter";
import { ADD_CUSTOM_FILTER      } from "../store/lists/mutations";
import TemplateParsingService   from "./TemplateParsingService";
import GradeTypeFilterComponent from "../components/content/filters/GradeTypeFilter";

class RatingsService {

    constructor () {
        this.router = Router;
        this.templateParser = TemplateParsingService;
    }

    /**
     * Get ratings based on passed filters object
     *
     * @param {Object} filters
     * @return {Object}
     */
    async getRatings(filters) {
        const url = this.router.get('api_get_ratings', filters);
        let { data: { ratings, pageCount } } = await axios.get(url);
        ratings = ratings.map(ratings => new Rating(ratings));
        return { ratings, pageCount };
    }

    /**
     * Compensates the rating with passed discountValue
     *
     * @param {Rating} rating
     * @param {number} discountValue
     * @return {Object}
     */
    async compensate(rating, discountValue) {
        const url = this.router.get('api_ratings_compensate', { idRating: rating.getId() });
        return await axios.post(url, { discountValue });
    }

    getRatingsFromTemplate() {
        const ratings = this.templateParser.parse('ratings');
        return ratings ? ratings.map(order => new Rating(order)) : [];
    }

    getPageCountFromTemplate() {
        const pageCount = this.templateParser.parse('ratings-page-count');
        return pageCount ? +pageCount : 0;
    }

    addCustomFiltersToStore(scope) {
        scope.$store.commit(ADD_CUSTOM_FILTER, new CustomFilter({
            id: 'GradeTypeFilter',
            component: GradeTypeFilterComponent,
            callback: value => {
                scope.ratingType = value && value > 0 ? +value : 0;
                scope.getRatings();
            }
        }))
    }

}

export default new RatingsService();

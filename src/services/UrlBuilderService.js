import routes from "../data/api-routes";
import { RestURLBuilder } from "rest-url-builder";

class UrlBuilderService {

    host = 'http://zbinski.bistro-api-v2.azet.dev7/api';

    /**
     * @var {Object} routes
     */
    routes = routes;

    /**
     * @var {RestURLBuilder} routes
     */
    urlBuilder = undefined;

    /**
     * @param {RestURLBuilder} urlBuilder
     */
    constructor(urlBuilder = RestURLBuilder) {
        this.urlBuilder = urlBuilder;
    }

    /**
     * Returns requested URL by name
     *
     * @param {String} name
     * @param {Object} namedParameters
     * @param {Object} queryParameters
     * @return {String}
     * @throws Error
     *  - when route does not exist
     *  - when parameter is missing
     */
    get(name, namedParameters = {}, queryParameters = {}) {
        if (!this.routes.hasOwnProperty(name)) {
            throw new Error(`Route ${name} does not exist`);
        }
        let builder = new this.urlBuilder();
        builder = builder.buildRestURL(this.host + this.routes[name]);
        UrlBuilderService.addUrlParameters(builder, {
            namedParameters,
            queryParameters
        });
        return builder.get();
    }

    /**
     * Adds parameters to URL
     *
     * @param {RestURLBuilder} builder
     * @param {Object} namedParameters
     * @param {Object} queryParameters
     */
    static addUrlParameters(builder, { namedParameters, queryParameters }) {
        for (const param in namedParameters) {
            builder.setNamedParameter(param, namedParameters[param]);
        }
        for (const param in queryParameters) {
            builder.setQueryParameter(param, queryParameters[param]);
        }
    }
}

export default new UrlBuilderService();

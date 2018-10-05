import { SET_QUERY_PARAMETERS } from "../lists/actions";
import {
    SET_DATE_TO,
    SET_DATE_FROM,
    TRIGGER_ACTIVE_RESTAURANT,
    ACTIVATE_ALL_RESTAURANTS
} from "../lists/mutations";


/**
 * Types of mutation for which subscribe method should trigger query update
 *
 * @type {string[]}
 */
const updateQueryParametersTriggers = [
    ACTIVATE_ALL_RESTAURANTS,
    TRIGGER_ACTIVE_RESTAURANT,
    SET_DATE_FROM,
    SET_DATE_TO
];

/**
 * Vuex plugin for preparing the filters
 *
 * @param store
 */
export default store => {

    /**
     * Updates URL's query parameters whenever mutation from `updateQueryParametersTriggers` is committed
     */
    store.subscribe(mutation => {
        if (updateQueryParametersTriggers.indexOf(mutation.type) !== -1) {
            store.dispatch(SET_QUERY_PARAMETERS, {});
        }
    });
};

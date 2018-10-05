import Vue              from "vue";
import Vuex             from "vuex";
import Moment           from "moment";
import Router           from "@/router";
import FiltersService   from "@/services/FiltersService";
import CustomerService  from "@/services/CustomerService";
import * as Actions     from "@/store/lists/actions";
import FiltersPlugin    from '@/store/plugins/filters';

Vue.use(Vuex);

export default new Vuex.Store({
    strict: process.env.NODE_ENV !== 'production',
    state: {
        months: FiltersService.generateMonthObjects(),
        restaurants: [],
        dateFrom: Moment().startOf('month'),
        dateTo: Moment().endOf('day'),
        queryParameters: {},
        customFilters: []
    },

    getters: {
        activeRestaurants: state => state.restaurants.filter(restaurant => restaurant.isActive()),
        activeMonth: state => {
            const activeMonths = state.months.filter(month => month.isActive());
            if (activeMonths) {
                return activeMonths.pop();
            }
            return null;
        }
    },
    mutations: {
        // Months
        setMonths: (state, months) => state.months = months,
        activateMonth: (state, month) => state.months.map(i => i.setActiveState(i.getNumeric() === month.getNumeric())),
        deactivateMonths: state => state.months.map(item => item.setActiveState(false)),

        // Restaurants
        setRestaurants: (state, restaurants) => state.restaurants = restaurants,
        activateAllRestaurants: state => state.restaurants.map(restaurant => restaurant.setActiveState(true)),
        deactivateRestaurants: state => state.restaurants.map(restaurant => restaurant.setActiveState(false)),
        changeActiveStateOfRestaurant: (state, restaurant) => restaurant.setActiveState(!restaurant.isActive()),

        // Dates
        setDateFrom: (state, dateFrom) => state.dateFrom = dateFrom,
        setDateTo: (state, dateTo) => state.dateTo = dateTo,
        setQueryParameters: (state, queryParameters) => state.queryParameters = queryParameters,
        initDateFrom: (state, dateFrom) => state.dateFrom = dateFrom,
        initDateTo: (state, dateTo) => state.dateTo = dateTo,
        initQueryParameters: (state, queryParameters) => state.queryParameters = queryParameters,
        addCustomFilter: (state, filter) => {
            if (!state.customFilters.filter(item => item.getId() === filter.getId()).length) {
                state.customFilters.push(filter);
            }
        }
    },
    actions: {

        [Actions.GET_AVAILABLE_RESTAURANTS]: async ({ commit }) => {
            const restaurants = await CustomerService.getRestaurants();
            commit('setRestaurants', restaurants);
        },

        /**
         * Updates URL's query parameters
         *
         * @param {Object} state
         * @param {Function} commit
         * @param {Object} getters
         * @param {Object} data
         * @param {Boolean} initialize
         */
        setQueryParameters: ({ state, commit, getters }, { data, initialize = false }) => {
            // destructing is done in purpose to copy object as we cannot mutate state without committing
            let query = { ...data };
            query['dateFrom'] = state.dateFrom.format('YYYY-MM-DD');
            query['dateTo'] = state.dateTo.format('YYYY-MM-DD');
            const restaurants = getters.activeRestaurants.map(restaurant => restaurant.getId());
            const mutation = initialize ? 'initQueryParameters' : 'setQueryParameters';

            delete query['restaurants[]'];

            commit(mutation, { ...query, restaurants });

            query = { ...query, 'restaurants[]': restaurants };
            delete query['restaurants'];

            // Because of "[]" in the URL (without it back-end parses it as a string)
            Router.push({ query });
        },

        /**
         * Initializes filters from query parameters
         *
         * !!! WARNING !!!
         * It uses private "init"-prefixed mutation to not trigger update
         * if the update is triggered, preloading is unnecessary,
         * because AJAX request is created in order to update the data
         *
         * @param {Object} state
         * @param {Function} commit
         * @param {Object} rootState
         * @param {Function} dispatch
         */
        initializeFromQueryParameters: ({ state, commit, dispatch }) => {

            let data = state.route.query;

            // activate restaurants that are in the URL's query params
            if (data.hasOwnProperty('restaurants[]')) {
                if (!Array.isArray(data['restaurants[]'])) {
                    data['restaurants[]'] = [data['restaurants[]']];
                }
                commit('deactivateRestaurants');
                data['restaurants[]'] = data['restaurants[]'].map(restaurantId => +restaurantId);
                state.restaurants.map(restaurant => {
                    if (data['restaurants[]'].indexOf(restaurant.getId()) !== -1) {
                        commit('changeActiveStateOfRestaurant', restaurant);
                    }
                });
            }
            if (data.hasOwnProperty('dateFrom')) {
                commit('initDateFrom', Moment(data.dateFrom));
            }
            if (data.hasOwnProperty('dateTo')) {
                // .endOf('day') because of the 23:59:59 at the end (for month finding)
                commit('initDateTo', Moment(data.dateTo).endOf('day'));
            }

            dispatch('setQueryParameters', { data, initialize: true });

            // look up the active month based on dates
            const today = Moment().endOf('day');
            const startOfMonth = state.dateFrom.clone().startOf('month');
            let endOfMonth = state.dateFrom.clone().endOf('month');

            // if end of month is after today, set today as max. date
            endOfMonth = endOfMonth > today ? today : endOfMonth;

            if (startOfMonth.isSame(state.dateFrom) && endOfMonth.isSame(state.dateTo)) {
                const month = state.months.find(month => month.getNumeric() === +startOfMonth.format('M'));
                commit('activateMonth', month);
            }
        },

        /**
         * Changes active month and updates dateFrom, dateTo states
         *
         * @param {Function} commit
         * @param {Month} month
         */
        changeActiveMonth: ({ commit }, month) => {
            commit('activateMonth', month);

            // Date From
            const date = Moment(`${month.getYear()}-${month.getNumeric()}-01`, "YYYY-MM-DD");
            commit('setDateFrom', date.clone().startOf('month'));

            // Date To
            const dateTo = date.clone().endOf('month');
            const now = Moment().endOf('day');
            commit('setDateTo', dateTo > now ? now : dateTo);
        }
    },
    plugins: [
        FiltersPlugin
    ]
});

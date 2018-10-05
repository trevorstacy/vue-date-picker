import Vuex from 'vuex';
import Sidebar from '@/components/AppSidebar';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import { GET_AVAILABLE_RESTAURANTS } from "@/store/lists/actions";
import Restaurant from "@/model/Restaurant";
import {ACTIVATE_ALL_RESTAURANTS} from "@/store/lists/mutations";
import {ACTIVE_RESTAURANTS} from "@/store/lists/getters";

const localVue = createLocalVue();
localVue.use(Vuex);

const restaurants = [
    new Restaurant({
        id: 1,
        name: 'TestRestaurant',
        idStore: 2,
        logoURL: 'http://logo.url/image.jpg',
        allowDmToggle: true,
        active: false
    }),
    new Restaurant({
        id: 2,
        name: 'TestRestaurant 2',
        idStore: 3,
        logoURL: 'http://logo.url/image.jpg',
        allowDmToggle: true,
        active: false
    })
];

const storeConfig = {
    state: { restaurants },
    getters: {
        [ACTIVE_RESTAURANTS]: state => state.restaurants.filter(f => f.isActive())
    },
    mutations: {
        [ACTIVATE_ALL_RESTAURANTS]: s => s.restaurants.map(r => r.setActiveState(true))
    },
    actions: {
        [GET_AVAILABLE_RESTAURANTS]: () => true
    }
};

describe('Sidebar.vue', () => {

    it('should dispatch restaurants getting on created', () => {
        const actions = { [GET_AVAILABLE_RESTAURANTS]: jest.fn(() => []) };
        const store = new Vuex.Store({ ...storeConfig, actions });
        shallowMount(Sidebar, { localVue, store });
        expect(actions[GET_AVAILABLE_RESTAURANTS]).toHaveBeenCalled();
    });

    it('should trigger restaurants activation on click', () => {
        const mutations = { [ACTIVATE_ALL_RESTAURANTS]: jest.fn() };
        const store = new Vuex.Store({ ...storeConfig, mutations });
        const wrapper = shallowMount(Sidebar, { localVue, store });
        wrapper.find('.select-all-button').trigger('click');
        expect(mutations[ACTIVATE_ALL_RESTAURANTS]).toHaveBeenCalled();
    });

    it('should have activation button disabled when all restaurants are active', () => {
        const mutations = { [ACTIVATE_ALL_RESTAURANTS]: jest.fn() };
        restaurants.map(r => r.setActiveState(true));
        const store = new Vuex.Store({ ...storeConfig, mutations });
        const wrapper = shallowMount(Sidebar, { localVue, store });
        expect(wrapper.find('.select-all-button').classes('select-all-button--disabled')).toEqual(true);
    });

    it('should activate all restaurants', () => {
        restaurants.map(r => r.setActiveState(false));
        const store = new Vuex.Store(storeConfig);
        const wrapper = shallowMount(Sidebar, { localVue, store });
        wrapper.vm.activateAllRestaurants();
        expect(restaurants.every(r => r.isActive())).toEqual(true);
    });

    it('isEveryRestaurantActive computed property should work correctly', () => {
        const store = new Vuex.Store(storeConfig);
        const wrapper = shallowMount(Sidebar, { localVue, store });

        // all active
        restaurants.map(r => r.setActiveState(true));
        expect(wrapper.vm.isEveryRestaurantActive).toEqual(true);

        // few inactive
        restaurants[0].setActiveState(false);
        expect(wrapper.vm.isEveryRestaurantActive).toEqual(false);

        // all inactive
        restaurants.map(r => r.setActiveState(false));
        expect(wrapper.vm.isEveryRestaurantActive).toEqual(false);

    });
});

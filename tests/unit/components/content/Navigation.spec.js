import Router from 'vue-router';
import router from '@/router';
import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import Navigation from '@/components/content/Navigation';
import menuItems from '@/data/menu-items';
import Restaurant from '@/model/Restaurant';
import { ACTIVE_RESTAURANTS } from "@/store/lists/getters";

const localVue = createLocalVue();
localVue.use(Router);
localVue.use(Vuex);

describe('Navigation.vue', () => {

    it('should have menuItems set', () => {
        const store = new Vuex.Store({
            state: { restaurants: [] },
            getters: { [ACTIVE_RESTAURANTS]: state => state.restaurants }
        });
        const wrapper = shallowMount(Navigation, { localVue, router, store });
        expect(wrapper.vm.menuItems).toEqual(menuItems);
    });

    it('should get active restaurants', () => {
        const activeRestaurantsMocked = [
            new Restaurant({
                id: 1,
                name: 'TestRestaurant',
                idStore: 2,
                logoURL: 'http://logo.url/image.jpg',
                allowDmToggle: true,
                active: true
            })
        ];
        const getters = { [ACTIVE_RESTAURANTS]: jest.fn(state => state.restaurants) };
        const store = new Vuex.Store({
            getters,
            state: { restaurants: activeRestaurantsMocked }
        });
        const wrapper = shallowMount(Navigation, { localVue, store, router });
        expect(getters[ACTIVE_RESTAURANTS]).toHaveBeenCalled();
        expect(wrapper.vm.activeRestaurants).toEqual(activeRestaurantsMocked);
    })
});

import { shallowMount } from '@vue/test-utils';
import SidebarRestaurant from '@/components/sidebar/SidebarRestaurant';
import Restaurant from "@/model/Restaurant";

const restaurant = new Restaurant({
    id: 1,
    name: 'TestRestaurant',
    idStore: 2,
    logoURL: 'http://logo.url/image.jpg',
    allowDmToggle: true,
    active: true
});

describe('SidebarRestaurant.vue', () => {

    it('should warn on no props passed', () => {
        const errors = [];
        const consoleErrorCopy = console.error;
        console.error = error => errors.push(error);

        shallowMount(SidebarRestaurant);
        expect(
            errors.find(error => error.indexOf('Missing required prop: "restaurant"') > -1)
        ).not.toEqual(undefined);

        console.error = consoleErrorCopy;
    });

    it('should commit restaurant\'s state change on click', () => {
        const methods = { triggerActive: jest.fn() };
        const propsData = { restaurant };
        const wrapper = shallowMount(SidebarRestaurant, { methods, propsData });
        wrapper.find('.sidebar-restaurant').trigger('click');
        expect(methods.triggerActive).toHaveBeenCalled();
    });
});
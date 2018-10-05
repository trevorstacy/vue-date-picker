import router from '@/router';
import Router from 'vue-router';
import AppHeader from '@/components/AppHeader';
import { shallowMount, createLocalVue } from '@vue/test-utils';

const localVue = createLocalVue();
localVue.use(Router);

describe('AppHeader.vue', () => {
    it('should contain a router-link', () => {
        const wrapper = shallowMount(AppHeader, { localVue, router });
        const routerLink = wrapper.find('router-link');
        expect(routerLink).not.toEqual(undefined);
    });
});

import { createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import App from '@/App';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('App.vue', () => {
    it('should have registered components', () => {
        expect(App.components).not.toBe({});
    });
});

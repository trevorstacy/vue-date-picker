import { shallowMount } from '@vue/test-utils';
import RegionalManager from '@/components/sidebar/RegionalManager';

describe('RegionalManager.vue', () => {

    it('should have created life cycle', () => {
        expect(typeof RegionalManager.created).toEqual('function');
    });

    it('should have regional manager in component\'s data', () => {
        expect(typeof RegionalManager.data).toEqual('function');
        expect(RegionalManager.data()).toHaveProperty('regionalManager');
    });

    it('should call getRegionalManager method', async () => {
        const methods = { getRegionalManager: jest.fn() };
        shallowMount(RegionalManager, { methods });
        expect(methods.getRegionalManager).toHaveBeenCalled();
    });
});
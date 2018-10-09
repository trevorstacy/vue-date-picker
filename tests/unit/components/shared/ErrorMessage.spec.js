import { shallowMount } from '@vue/test-utils';
import Divider from '@/components/shared/Divider';

describe('Divider.vue', () => {

    it('should set divider\'s class correctly', () => {
        const wrapper = shallowMount(Divider);
        expect(wrapper.find('.divider').classes('divider--horizontal')).toBeTruthy();
        wrapper.setProps({ direction: 'vertical' });
        expect(wrapper.find('.divider').classes('divider--vertical')).toBeTruthy();
    });

    it('should set divider\'s color correctly', () => {
        const wrapper = shallowMount(Divider);
        expect(wrapper.find('.divider').hasStyle('border-color', '#333')).toBeTruthy();
        wrapper.setProps({ color: '#666' });
        expect(wrapper.find('.divider').hasStyle('border-color', '#666')).toBeTruthy();
    });

    it('should set divider\'s size correctly', () => {
        const wrapper = shallowMount(Divider);
        expect(wrapper.find('.divider').element.style.borderWidth === '1px').toBeTruthy();
        wrapper.setProps({ size: 3 });
        expect(wrapper.find('.divider').element.style.borderWidth === '3px').toBeTruthy();
    });
});

import router from '@/router';

describe('router.js', () => {
    it('should have \'history\' mode set', () => {
        expect(router.mode).toEqual('history');
    });
    it('should have at least 6 routes', () => {
        expect(router.options.routes.length).toBeGreaterThanOrEqual(6);
    });
});
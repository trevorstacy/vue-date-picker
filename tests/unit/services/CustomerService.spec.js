import UrlBuilderService from '../../../src/services/UrlBuilderService';

const existingRouteWithoutParams = 'test';
const nonExistingRouteWithoutParams = 'test2';
const existingRouteWithParam = 'test3';
const existingRouteWithMultipleParams = 'test4';
const existingRouteWithQueryParam = 'test5';

UrlBuilderService.host = '';
UrlBuilderService.routes = {
    [existingRouteWithoutParams]: '/test/',
    [existingRouteWithParam]: '/test/:idTest',
    [existingRouteWithMultipleParams]: '/test/:idRestaurant/:idParam',
    [existingRouteWithQueryParam]: '/test/:idRestaurant/:idParam/?queryParam=:queryParam'
};

describe('UrlBuilderService', () => {
    it('returns correct URI without parameters', () => {
        expect(UrlBuilderService.get(existingRouteWithoutParams))
            .toEqual('/test/');
    });
    it('throws error on non-existing route', () => {
        expect(() => UrlBuilderService.get(nonExistingRouteWithoutParams))
            .toThrowError(`Route ${nonExistingRouteWithoutParams} does not exist`);
    });
    it('throws error on URI without required parameter', () => {
        expect(() => UrlBuilderService.get(existingRouteWithParam))
            .toThrow(`The parameter :idTest has not been set`);
    });
    it('throws error on URI without multiple required parameters', () => {
        expect(() => UrlBuilderService.get(existingRouteWithMultipleParams))
            .toThrow(`The parameter :idRestaurant has not been set`);
    });
    it('gets correct URI with parameters', () => {
        expect(UrlBuilderService.get(existingRouteWithMultipleParams, {
            idRestaurant: 1,
            idParam: 100
        })).toEqual(`/test/1/100`);
    });
    it('gets correct URI with query parameters', () => {
        expect(UrlBuilderService.get(existingRouteWithQueryParam, {
            idRestaurant: 1,
            idParam: 100
        }, {
            queryParam: 1
        })).toEqual(`/test/1/100/?queryParam=1`);
    });
});

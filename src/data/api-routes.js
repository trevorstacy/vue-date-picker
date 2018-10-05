export const URL_RESTAURANTS                = 'customer_restaurants';
export const URL_REGIONAL_MANAGER           = 'customer_regionalManager';
export const URL_ORDERS                     = 'orders';
export const URL_ORDER_DETAIL               = 'order';
export const URL_RATINGS                    = 'ratings';
export const URL_RATING_COMPENSATION        = 'ratingCompensation';
export const URL_DAILY_MENUS                = 'dailyMenus';
export const URL_DAILY_MENU_UPDATE_STATE    = 'dailyMenuUpdateState';
export const URL_DELIVERIES                 = 'deliveries';
export const URL_STATISTICS                 = 'stats';

export const routes = {
    // Global
    [URL_RESTAURANTS]:      '/customer/restaurants/',
    [URL_REGIONAL_MANAGER]: '/customer/regional-manager/',

    // Orders
    [URL_ORDERS]:       '/orders/',
    [URL_ORDER_DETAIL]: '/order/:id/',

    // Ratings
    [URL_RATINGS]:              '/ratings/',
    [URL_RATING_COMPENSATION]:  '/rating/:id/',

    // Daily menus
    [URL_DAILY_MENUS]:              '/daily-menus/',
    [URL_DAILY_MENU_UPDATE_STATE]:  '/daily-menu/:id/',

    // Deliveries
    [URL_DELIVERIES]: '/deliveries/:mode/',

    // Stats
    [URL_STATISTICS]: '/stats/:type/'
};

export default routes;

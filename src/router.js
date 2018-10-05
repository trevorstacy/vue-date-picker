import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            redirect: { name: 'orders' }
        },
        {
            path: '/orders',
            name: 'orders',
            title: 'Objednávky - Administrácia pre reštaurácie - Bistro.sk',
            component: () => import(/* webpackChunkName: "orders" */ './views/Orders.vue')
        },
        {
            path: '/ratings',
            name: 'ratings',
            title: 'Hodnotenia - Administrácia pre reštaurácie - Bistro.sk',
            component: () => import(/* webpackChunkName: "ratings" */ './views/Ratings.vue')
        },
        {
            path: '/daily-menus',
            name: 'dailyMenus',
            title: 'Denné menu - Administrácia pre reštaurácie - Bistro.sk',
            component: () => import(/* webpackChunkName: "daily-menus" */ './views/DailyMenus.vue')
        },
        {
            path: '/deliveries',
            name: 'deliveries',
            title: 'Čas doručenia - Administrácia pre reštaurácie - Bistro.sk',
            component: () => import(/* webpackChunkName: "deliveries" */ './views/Deliveries.vue')
        },
        {
            path: '/stats',
            name: 'stats',
            title: 'Štatistiky - Administrácia pre reštaurácie - Bistro.sk',
            component: () => import(/* webpackChunkName: "stats" */ './views/Stats.vue')
        }
    ]
});

import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store/store';
import './registerServiceWorker';

import axios from 'axios';
axios.defaults.withCredentials = true;

Vue.config.productionTip = false;

import { Vuetify, VApp, VSnackbar } from 'vuetify';
Vue.use(Vuetify, {
    components: {
        VApp,
        VSnackbar
    }
});

import { sync } from 'vuex-router-sync';
sync(store, router);

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');

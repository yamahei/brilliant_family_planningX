import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from 'vue-router/auto-routes'
import { Biz } from './biz/biz.ts';

import App from './App.vue'

const router = createRouter({
    routes,
    history: createWebHistory(),
    scrollBehavior() {//遷移時にページのトップにスクロールする
        return { top: 0 }
    },
});

const biz = Biz.getInstance();
Promise.resolve().then(() => {//TODO: wait for data loading

    const app = createApp(App);
    app.use(router);
    app.mount('#app');
    app.config.globalProperties.$biz = biz;
    app.config.errorHandler = (err, vm, info) => {
        console.error([
            "errorHandler gets error.",
            "log error information and redirect to /500.",
        ].join("\n"));
        console.debug({err, vm, info});
        router.replace("/500");
    };

})

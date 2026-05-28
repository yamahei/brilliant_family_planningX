// See:
//   Getting Started@Vue Router
//   https://next.router.vuejs.org/guide/
(async function(g){

/**
 * for SFC
 * https://github.com/FranckFreiburger/vue3-sfc-loader
 */
const options = {
    moduleCache: { vue: Vue },
    async getFile(url) {
        const res = await fetch(url);
        if ( !res.ok ){
            throw Object.assign(new Error(res.statusText + ' ' + url), { res });
        }else{
            return { getContentData: asBinary => asBinary ? res.arrayBuffer() : res.text() };
        }
    },
    addStyle(textContent) {
        const style = Object.assign(document.createElement('style'), { textContent });
        const ref = document.head.getElementsByTagName('style')[0] || null;
        document.head.insertBefore(style, ref);
    },
}
const { loadModule } = window['vue3-sfc-loader'];

/**
 * Loader
 */
const loader = document.getElementById("loader");
const show_loader = ()=>{ loader.classList.add("is-active"); };
const hide_loader = ()=>{ loader.classList.remove("is-active"); };

/**
 * App
 */
// App
// const biz = g.biz = new Biz();
// const gui = {};
// const app = Vue.createApp({ biz: biz });
const app = Vue.createApp({});
const biz = g.$biz = new Biz();
app.config.globalProperties.$biz = biz;
app.config.globalProperties.$filters = {
    formatNumber(_number, digit){
        const number = _number * 1;
        const formatable = isFinite(number) && !isNaN(number);
        if(!formatable){ return "-"; }
        return number.toLocaleString(undefined, {
            minimumFractionDigits: digit,
            maximumFractionDigits: digit
        });
    },
};

app.config.globalProperties.$reg_mail = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
app.config.globalProperties.$token = {
    get(){ return g.localStorage.getItem("LIFEPLAN_SESSION_TOKEN"); },
    set(token){ g.localStorage.setItem("LIFEPLAN_SESSION_TOKEN", token); },
};

Promise.resolve()
.then(()=>{
    // Components
    return Promise.all([
        // sample
        loadModule('js/component/ui/my-component.vue', options),
        loadModule('js/component/ui/month-component.vue', options),
        loadModule('js/component/ui/expression-component.vue', options),
        // dialog/modal
        loadModule('js/component/ui/edit-section-component.vue', options),
        loadModule('js/component/ui/edit-entity-component.vue', options),
        loadModule('js/component/ui/edit-event-component.vue', options),
        loadModule('js/component/ui/input-preset-component.vue', options),
        // parts for rule
        loadModule('js/component/ui/event-component.vue', options),
        loadModule('js/component/ui/entity-component.vue', options),
        loadModule('js/component/ui/section-component.vue', options),
    ]);
}).then((components)=>{
    // sample
    app.component("my-component", components.shift());
    app.component("month-component", components.shift());
    app.component("expression-component", components.shift());
    // dialog/modal
    app.component("edit-section-component", components.shift());
    app.component("edit-entity-component", components.shift());
    app.component("edit-event-component", components.shift());
    app.component("input-preset-component", components.shift());
    // parts for rule
    app.component("event-component", components.shift());
    app.component("entity-component", components.shift());
    app.component("section-component", components.shift());
    return true;
})
// Init App
.then(()=>{
    // Page Components
    return Promise.all([
        loadModule('js/component/page/login.vue', options),
        loadModule('js/component/page/home.vue', options),
        loadModule('js/component/page/rule.vue', options),
        loadModule('js/component/page/calendar.vue', options),
        // loadModule('js/component/page/about.vue', options),
    ])
}).then((pages)=>{
    // Router
    const routes = [];
    routes.push({ path: '/', component: pages.shift() });
    // routes.push({ path: '/login', component: pages.shift() });
    routes.push({ path: '/home', component: pages.shift() });
    routes.push({ path: '/rule', component: pages.shift() });
    routes.push({ path: '/calendar', component: pages.shift() });
    // routes.push({ path: '/about', component: pages.shift() });
    return routes;
}).then((routes)=>{
    const router = VueRouter.createRouter({
        history: VueRouter.createWebHashHistory(),
        routes,
    });
    biz.set_request_start_finish_hook(show_loader, hide_loader);
    biz.set_error_hook(401, (error)=>{
        console.log(error);
        router.replace("/");//login
    });
    hide_loader();

    app.use(router);
    // Mount
    app.mount('#app');
}).catch((e)=>{
    console.log(e);
    alert(e?.message || "failed to init.");
});


})(this);

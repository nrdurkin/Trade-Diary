import VueRouter from "vue-router";

import home from "./views/home.vue";

let routes = [];

routes.push({
    path: "/home",
    component: home
});

routes.push({
    path: "/",
    component: home
});

export const router = new VueRouter({ routes: routes, mode: "history" });

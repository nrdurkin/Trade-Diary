import Vue from "vue";
import VueRouter from "vue-router";
import { router } from "./router";

Vue.use(VueRouter);

window.vue = new Vue({
    el: "#app",
    router: router
});

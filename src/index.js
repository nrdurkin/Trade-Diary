import Vue from "vue";
import VueRouter from "vue-router";
import { router } from "./router";
import { components } from "./components/index";

Vue.use(VueRouter);

//Register Components
//Replace underscores with kebab case
for (let component in components)
    Vue.component(component.replace("_", "-"), components[component]);

Vue.filter("money", (value) => {
    if (value != parseFloat(value)) return value;
    value = value.toString();
    if (value.charAt(value.length - 2) == ".") value += "0";
    if (value.charAt(0) == "-") return "-$" + value.slice(1);
    else return "$" + value;
});

window.vue = new Vue({
    el: "#app",
    router: router
});

import { createApp } from "vue";
import { createPinia } from "pinia";
import "./dist/css/bootstrap.min.css";
import "./assets/css/style.css";

import "@fortawesome/fontawesome-free/css/all.min.css";
import App from "./App.vue";
import router from "./router";

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount("#app");
import "./dist/js/bootstrap.bundle.min.js";

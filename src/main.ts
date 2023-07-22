import { createApp } from "vue";
import { createPinia } from "pinia";
import { createVuetify } from "vuetify";

import notifications from "@kyvg/vue3-notification";
import router from "./router";
import i18n from "./i18n";
import App from "./App.vue";
import refreshUserInfo from "@/helpers/firebase/firebaseRefresh";

// Styles
import "normalize.css";
import "vuetify/styles";

const vuetify = createVuetify();

const pinia = createPinia();

const app = createApp(App);

// Plugins
app.use(router);
app.use(pinia);
app.use(vuetify);
app.use(i18n);
app.use(notifications);

app.mount("#app");

refreshUserInfo();

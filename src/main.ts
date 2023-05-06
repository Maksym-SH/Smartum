import { createApp } from "vue";
import { createPinia } from 'pinia'

import App from "./App.vue";
import router from "./router";
import refreshUserInfo from "@/helpers/firebase/firebaseRefresh";

// Firebase initilialize
import { firebaseApp } from "./helpers/firebase/firebaseInitialize";
firebaseApp;

// Components
import Button from "@/components/UI/Button.vue";
import Input from "@/components/UI/Input.vue";
import Textarea from "@/components/UI/Textarea.vue";
import Checkbox from "@/components/UI/Checkbox.vue";
import Loader from "@/components/UI/Loader.vue";
import Select from "@/components/UI/Select.vue";
import ExpPanel from "@/components/UI/ExpansionPanel.vue";

// Vuetify
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

// Notificaton
import notifications from "@kyvg/vue3-notification";
// Styles
import "normalize.css";
import "vuetify/styles";
import "@mdi/font/css/materialdesignicons.css";

const vuetify = createVuetify({
  components,
  directives,
});

const pinia = createPinia();
const app = createApp(App);

// Global components
app.component("Input", Input);
app.component("Textarea", Textarea);
app.component("Button", Button);
app.component("Checkbox", Checkbox);
app.component("Loader", Loader);
app.component("Select", Select);
app.component("ExpPanel", ExpPanel);

// Plugins
app.use(router);
app.use(pinia);
app.use(vuetify);
app.use(notifications);

app.mount("#app");


refreshUserInfo();
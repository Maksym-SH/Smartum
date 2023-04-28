import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

// Firebase
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { firebaseConfig } from "./helpers/firebase/firebaseConfig";
import { getFirestore } from "firebase/firestore";

// Components
import Button from "./components/ui/Button.vue";
import Input from "./components/ui/Input.vue";
import Textarea from "./components/ui/Textarea.vue";
import Checkbox from "./components/ui/Checkbox.vue";
import Loader from "./components/ui/Loader.vue";
import Select from "./components/ui/Select.vue";
import ExpPanel from "./components/ui/ExpansionPanel.vue";

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const analytics = getAnalytics(firebaseApp);
export const database = getFirestore(firebaseApp);

import refreshUserInfo from "@/helpers/firebase/firebaseRefresh";
refreshUserInfo();

// Global export
export let emailValidator = require("email-validator");

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
app.use(store);
app.use(vuetify);
app.use(notifications);

app.mount("#app");

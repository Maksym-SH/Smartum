import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

// Firebase
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { firebaseConfig } from "./helpers/firebase/firebaseConfig";

// Components
import Button from "./components/ui/Button.vue";
import Input from "./components/ui/Input.vue";
import Checkbox from "./components/ui/Checkbox.vue";
import Loader from "./components/ui/Loader.vue";
import Select from "./components/ui/Select.vue";

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const analytics = getAnalytics(firebaseApp);
import RefreshToken from "@/helpers/firebase/firebaseRefresh";
RefreshToken();
// Global export
export let emailValidator = require("email-validator");

// Vuetify
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

// Notificaton
import Notifications from "@kyvg/vue3-notification";
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
app.component("Button", Button);
app.component("Checkbox", Checkbox);
app.component("Loader", Loader);
app.component("Select", Select);

// Plugins
app.use(router);
app.use(store);
app.use(vuetify);
app.use(Notifications);

app.mount("#app");

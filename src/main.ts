import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from "./store";

// Firebase
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { firebaseConfig } from './helpers/firebase/firebaseConfig';

// Components
import customButton from "./components/UI/button/index.vue";
import customInput from "./components/UI/input/index.vue";
import customCheckbox from "./components/UI/checkbox/index.vue";
import customLoader from "./components/UI/loader/index.vue";

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const analytics = getAnalytics(firebaseApp);

// Global export 
export let emailValidator = require("email-validator");

// Vuetify
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// Notificaton
import Notifications from '@kyvg/vue3-notification';
// Styles
import "normalize.css";
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'

const vuetify = createVuetify({
  components,
  directives,
})
const app = createApp(App);

// Global components
app.component("c-input", customInput);
app.component("c-button", customButton);
app.component("c-checkbox", customCheckbox);
app.component("c-loader", customLoader);

// Plugins
app.use(router);
app.use(store);
app.use(vuetify);
app.use(Notifications);

app.mount('#app');

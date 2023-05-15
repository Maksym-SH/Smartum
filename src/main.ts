import { createApp } from "vue";
import { createPinia } from "pinia";

import { createVuetify } from "vuetify";

import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import notifications from "@kyvg/vue3-notification";
import App from "./App.vue";
import router from "./router";
import refreshUserInfo from "@/helpers/firebase/firebaseRefresh";

// Components
import cButton from "@/components/UI/Button.vue";
import cInput from "@/components/UI/Input.vue";
import cTextarea from "@/components/UI/Textarea.vue";
import cCheckbox from "@/components/UI/Checkbox.vue";
import cLoader from "@/components/UI/Loader.vue";
import cSelect from "@/components/UI/Select.vue";
import cExpPanel from "@/components/UI/ExpansionPanel.vue";

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
app.component("CInput", cInput);
app.component("CTextarea", cTextarea);
app.component("CButton", cButton);
app.component("CCheckbox", cCheckbox);
app.component("CLoader", cLoader);
app.component("CSelect", cSelect);
app.component("CExpPanel", cExpPanel);

// Plugins
app.use(router);
app.use(pinia);
app.use(vuetify);
app.use(notifications);

app.mount("#app");

refreshUserInfo();

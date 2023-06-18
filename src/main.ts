import { createApp } from "vue";
import { createPinia } from "pinia";
import { createVuetify } from "vuetify";
import router from "./router";

// Packages
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import notifications from "@kyvg/vue3-notification";

// Styles
import "normalize.css";
import "vuetify/styles";

import refreshUserInfo from "@/helpers/firebase/firebaseRefresh";

// Components
import App from "./App.vue";
import AppButton from "@/components/UI/AppButton.vue";
import AppInput from "@/components/UI/AppInput.vue";
import AppTextarea from "@/components/UI/AppTextarea.vue";
import AppCheckbox from "@/components/UI/AppCheckbox.vue";
import AppLoader from "@/components/UI/AppLoader.vue";
import AppSelect from "@/components/UI/AppSelect.vue";
import AppExpansionPanel from "@/components/UI/AppExpansionPanel.vue";

const vuetify = createVuetify({
  components,
  directives,
});

const pinia = createPinia();
const app = createApp(App);

// Global components
app.component("AppInput", AppInput);
app.component("AppTextarea", AppTextarea);
app.component("AppButton", AppButton);
app.component("AppCheckbox", AppCheckbox);
app.component("AppLoader", AppLoader);
app.component("AppSelect", AppSelect);
app.component("AppExpansionPanel", AppExpansionPanel);

// Plugins
app.use(router);
app.use(pinia);
app.use(vuetify);
app.use(notifications);

app.mount("#app");

refreshUserInfo();

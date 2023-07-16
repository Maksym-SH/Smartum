<template>
  <AppSelect
    v-if="type === 'select'"
    :width="95"
    :variant="variant"
    :items="selectItems"
    location="start"
    :select-icon="languageTextInfo.icon"
    :active-style="false"
    :button-title="languageTextInfo.title"
    @selected="selected"
  />
  <AppButton
    v-else
    :variant="variant"
    :icon="languageTextInfo.icon"
    :title="languageTextInfo.title"
    class="switch-language"
    @click="changeLanguage()"
  />
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, reactive } from "vue";
import { LocalLanguage } from "@/helpers/methods";

import useCurrentLanguage from "@/composables/useCurrentLanguage";
import useSelectActions from "@/composables/useSelectActions";

import AppSelect from "./AppSelect.vue";
import AppButton from "./AppButton.vue";

import { Colors, Language } from "@/types/enums";
import type { PropType } from "vue";
import type { ButtonVariant, SelectElements, SwitchLanguageType } from "@/types";

export default defineComponent({
  components: {
    AppSelect,
    AppButton,
  },
  props: {
    type: {
      type: String as PropType<SwitchLanguageType>,
      default: "select",
    },
    rounded: {
      type: Boolean,
      default: false,
    },
    variant: {
      type: String as PropType<ButtonVariant>,
      default: "elevated",
    },
  },

  setup() {
    const { selected } = useSelectActions();

    const { changeLanguage, languageTextInfo } = useCurrentLanguage();

    const selectItems = reactive<SelectElements>([
      {
        title: "Русский",
        callback: () => changeLanguage(Language.RU),
        icon: "russian",
        color: Colors.DEFAULT,
        displaying: true,
        active: computed(() => languageTextInfo.title === "Русский"),
      },
      {
        title: "English",
        callback: () => changeLanguage(Language.ENG),
        icon: "english",
        color: Colors.DEFAULT,
        displaying: true,
        active: computed(() => languageTextInfo.title === "English"),
      },
    ]);

    onMounted(() => {
      if (LocalLanguage() === Language.RU) {
        languageTextInfo.icon = "russian";
        languageTextInfo.title = "Русский";
      }
    });

    return {
      selectItems,
      languageTextInfo,
      selected,
      changeLanguage,
      useSelectActions,
    };
  },
});
</script>

<style lang="scss" scoped>
.switch-language {
  text-transform: none;

  .c-button {
    display: inline-flex;
    width: 120px;
    :deep(svg) {
      align-self: center;
      margin-right: 10px;
      transform: scale(1.3);
    }
  }
}
</style>

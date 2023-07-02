<template>
  <AppSelect
    v-if="type === 'select'"
    :width="95"
    :variant="variant"
    :items="selectItems"
    location="start"
    @selected="selected"
    :selectIcon="languageTextInfo.icon"
    :active-style="false"
    :buttonTitle="languageTextInfo.title"
  />
  <AppButton
    v-else
    @click="changeLanguage()"
    :variant="variant"
    :icon="languageTextInfo.icon"
    :title="languageTextInfo.title"
    class="switch-language"
  />
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, PropType, reactive } from "vue";
import type { ButtonVariant, SelectElements, SwitchLanguageType } from "@/types/types";
import { Colors } from "@/types/enums";
import { LocalLanguage } from "@/helpers/methods";

import useCurrentLanguage from "@/composables/useCurrentLanguage";
import useSelectActions from "@/composables/useSelectActions";
import AppSelect from "./AppSelect.vue";

export default defineComponent({
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
  components: {
    AppSelect,
  },

  setup() {
    const { selected } = useSelectActions();

    const { changeLanguage, languageTextInfo } = useCurrentLanguage();

    const selectItems = reactive<SelectElements>([
      {
        title: "Русский",
        callback: () => changeLanguage("ru"),
        icon: "russian",
        color: Colors.Default,
        displaying: true,
        active: computed(() => languageTextInfo.title === "Русский"),
      },
      {
        title: "English",
        callback: () => changeLanguage("eng"),
        icon: "english",
        color: Colors.Default,
        displaying: true,
        active: computed(() => languageTextInfo.title === "English"),
      },
    ]);

    onMounted(() => {
      if (LocalLanguage() === "ru") {
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

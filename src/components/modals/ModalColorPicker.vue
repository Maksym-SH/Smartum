<template>
  <VDialog v-model="showDialog" transition="dialog-bottom-transition" width="auto">
    <template #activator="{ props }">
      <div class="color-picker">
        <AppButton
          v-bind="props"
          size="small"
          class="color-picker--open-modal"
          :color="buttonColor"
          :style="`color: ${colorPickParams.textColor}`"
          @click="showDialog = true"
        >
          <slot name="button-title">
            <img
              class="color-picker__palette"
              src="/images/icons/color-palette.svg"
              alt=""
            />
            <small class="color-picker__button-title">
              {{ $t("modal.colorPickTitle") }}</small
            >
          </slot>
        </AppButton>
        <span v-if="regenerate" class="color-picker--generate" @click="generateColor">
          <InlineSvg src="/images/icons/refresh.svg" />
          {{ $t("common.generate") }} ({{ colorPickParams.target }})
        </span>
      </div>
    </template>
    <template #default>
      <VCard>
        <VToolbar class="v-card__header">
          <h4 class="v-card__header-title">
            {{ $t("modal.colorPickTitle") }}
            <p v-if="showColorsTarget" class="v-card__header-title--additional">
              {{
                $t("common.shade", {
                  target: colorPickParams.target,
                })
              }}
            </p>
          </h4>
        </VToolbar>
        <VCardText class="v-card-colors__content">
          <div class="v-card-colors__content-grid">
            <BackgroundItem
              v-for="color in colorsCollection"
              :key="color"
              :background="color"
              :width="80"
              :height="40"
              :class="{ active: selectedColor === color }"
              @select="selectedColor = $event"
            />
          </div>
        </VCardText>
        <VCardActions class="v-card__footer">
          <AppButton
            class="v-card__footer--cancel"
            :title="$t('buttons.cancel')"
            variant="text"
            @click="closeDialog"
          />
          <AppButton
            class="v-card__footer--select-color"
            variant="text"
            type="submit"
            :title="$t('buttons.apply')"
            :disabled="!selectedColor"
            @click="changeColor()"
          />
        </VCardActions>
      </VCard>
    </template>
  </VDialog>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";

import { DarkColors, LightColors } from "@/helpers/colors";
import { GenerateColorHexFormat } from "@/helpers/methods";

import i18n from "@/i18n";

import InlineSvg from "vue-inline-svg";
import BackgroundItem from "../UI/BackgroundItem.vue";
import AppButton from "../UI/AppButton.vue";
import { VCard, VCardActions, VCardText, VDialog, VToolbar } from "vuetify/components";

import { Colors } from "@/types/enums";
import type { Theme } from "@/types";
import type { PropType } from "vue";
import type { IColorPickerParams } from "@/types/interfaces/colors";

export default defineComponent({
  components: {
    BackgroundItem,
    InlineSvg,
    AppButton,
    VDialog,
    VCard,
    VToolbar,
    VCardActions,
    VCardText,
  },
  props: {
    modelValue: {
      type: String,
      required: true,
    },
    theme: {
      type: String as PropType<Theme>,
      required: true,
    },
    regenerate: {
      type: Boolean,
      default: true,
    },
    showColorsTarget: {
      type: Boolean,
      default: true,
    },
    applyButtonColor: {
      type: Boolean,
      default: true,
    },
  },
  emits: ["selectColor", "update:modelValue", "selected"],
  setup(props, { emit }) {
    const { t } = i18n.global;

    const showDialog = ref(false);

    const colorPickParams = computed((): IColorPickerParams => {
      if (props.theme === "dark") {
        return {
          textColor: Colors.WHITE,
          target: t("common.dark"),
        };
      }
      // Light
      return {
        textColor: Colors.BLACK,
        target: t("common.light"),
      };
    });

    const colorsCollection = props.theme === "dark" ? DarkColors() : LightColors();

    const buttonColor = computed(() => {
      if (props.applyButtonColor) {
        return props.modelValue;
      }

      return Colors.LIGHT_GREY;
    });

    const selectedColor = ref<string>("");

    const closeDialog = () => {
      selectedColor.value = ""; // Clear selected color after close.
      showDialog.value = false;
    };

    const changeColor = (generatedColor?: string) => {
      const colorToSave = generatedColor || selectedColor.value;
      emit("update:modelValue", colorToSave);
      emit("selected");

      closeDialog();
    };

    const generateColor = () => {
      const generatedColor = GenerateColorHexFormat(props.theme);

      changeColor(generatedColor);
    };

    return {
      showDialog,
      colorPickParams,
      selectedColor,
      buttonColor,
      colorsCollection,
      Colors,
      generateColor,
      changeColor,
      closeDialog,
    };
  },
});
</script>

<style lang="scss" scoped>
.color-picker {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 145px;

  .c-button {
    text-transform: none;
  }

  &__palette {
    width: 15px;
  }

  &--generate {
    display: inline-flex;
    align-items: flex-start;
    justify-content: center;
    margin-top: 5px;
    color: $color-blue;
    font-size: 11px;
    white-space: nowrap;
    cursor: pointer;
    user-select: none;

    svg {
      width: 14px;
    }
  }
}

.v-dialog {
  :deep(.v-overlay__scrim) {
    opacity: 1;
    background: $color-transp-black !important;
  }

  .v-card {
    &__header {
      background-color: var(--color-background-secondary);
      border-bottom: 1px solid var(--color-border-card);

      &-title {
        display: inline-flex;
        align-items: center;
        padding: 0 30px;
        color: var(--color-text);

        &--additional {
          margin-left: 10px;
        }
      }
    }

    &-colors__content {
      background-color: var(--color-background);

      &-grid {
        display: grid;
        justify-content: center;
        align-content: center;
        height: 100%;
        grid-template-columns: repeat(5, auto);
        gap: 20px;
      }
    }

    &__footer {
      display: flex;
      justify-content: flex-end;
      background-color: var(--color-background-secondary);

      &--select-color {
        &:disabled {
          :deep(.v-btn__content) {
            color: var(--color-text);
          }
        }
      }
    }
  }

  @include mobile(max) {
    :deep(.v-overlay__content) {
      max-width: 100%;
      max-height: 100%;
      width: 100% !important;
      height: 100%;
      margin: 0;
    }

    .v-card {
      height: 100%;

      &__header {
        &-title {
          padding-left: 25px;
        }
      }

      &-colors__content {
        &-grid {
          grid-template-columns: repeat(4, 1fr);

          .image-example {
            max-width: none;
            width: 100% !important;
          }
        }
      }
    }
  }
}
</style>

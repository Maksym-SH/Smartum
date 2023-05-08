<template>
  <v-dialog
    transition="dialog-bottom-transition"
    width="auto"
    v-model="showDialog"
  >
    <template v-slot:activator="{ props }">
      <div class="color-picker">
        <Button 
          v-bind="props"
          size="small" 
          :color="modelValue" 
          :style="`color: ${ colorPickParams.textColor }`"
          @click="showDialog = true"
        >
          <img 
            class="color-picker__palette" 
            src="/images/icons/color-palette.svg" 
            alt=""
          >
          <small class="color-picker__button-title">
            Выбрать цвет 
          </small>
        </Button>
        <span 
          class="color-picker--generate"
          @click="generateColor"
        >
          <span class="mdi mdi-refresh"></span>
          Сгенерировать ({{ colorPickParams.target }})
        </span>
      </div>
    </template>
    <template #default>
      <v-card>
        <v-toolbar class="v-card__header">
          <h4 class="v-card__header-title">
            Выбор цвета 
            <p class="v-card__header-title--additional">
              ({{ colorPickParams.target }} оттенок)
            </p>
          </h4>
        </v-toolbar>
        <v-card-text class="v-card-colors__content">
          <div class="v-card-colors__content-grid">
            <BackgroundItem 
              v-for="color in colorsCollection" 
              :key="color"
              :background="color"
              :width="80"
              :height="40"
              @select="selectedColor = $event"
              :class="{ 'active': selectedColor === color }"
            />
          </div>
        </v-card-text>
        <v-card-actions class="v-card__footer">
          <Button
            class="v-card__footer--cancel"
            variant="text"
            @click="closeDialog"
          >
            Отмена
          </Button>
          <Button
            class="v-card__footer--select-color"
            variant="text"
            type="submit"
            :disabled="!selectedColor"
            @click="changeColor()"
          >
            Применить
          </Button>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, computed } from 'vue';
import { Theme } from '@/types';
import { LightColors, DarkColors } from '@/helpers/colors';
import { Colors } from '@/enums';
import { IColorPickerParams } from '@/interfaces';
import { GenerateColorHexFormat } from '@/helpers/methods';

import BackgroundItem from '../UI/BackgroundItem.vue';

export default defineComponent({
  components: {
    BackgroundItem
  },
  emits: ["selectColor", "update:modelValue"],
  props: {
    modelValue: {
      type: String,
      required: true
    },
    theme: {
      type: String as PropType<Theme>,
      required: true
    }
  },
  setup(props, { emit }) {
    const showDialog = ref(false);

    const colorPickParams = computed((): IColorPickerParams =>  {
      if (props.theme === "dark")  {
        return {
          textColor: Colors.White,
          target: "Тёмный",
        }
      }
      // Light 
      return {
        textColor: Colors.Black,
        target: "Светлый"
      }
    })

    const colorsCollection = props.theme === 'dark' ? DarkColors() : LightColors();

    const selectedColor = ref<string>("");

    const changeColor = (generatedColor?: string) => {
      const colorToSave = generatedColor ? generatedColor: selectedColor.value;
      emit('update:modelValue', colorToSave);

      closeDialog();
    }

    const closeDialog = () => {
      selectedColor.value = ""; // Clear selected color after close.
      showDialog.value = false;
    }

    const generateColor = () => {
      const generatedColor = GenerateColorHexFormat(props.theme);
      
      changeColor(generatedColor);
    }

    return {
      showDialog,
      colorPickParams,
      selectedColor,
      colorsCollection,
      Colors,
      generateColor,
      changeColor,
      closeDialog
    }
  }
})
</script>

<style lang="scss" scoped>
.color-picker {
  position: relative;
  display: flex;
  flex-direction: column;
  .c-button {
    text-transform: none;
  }
  &__palette {
    width: 15px;
  }
  &--generate {
    margin-top: 5px;
    color: $color-blue;
    font-size: 11px;
    white-space: nowrap;
    cursor: pointer;
    user-select: none;
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
      &-title {
        display: inline-flex;
        align-items: center;
        padding: 0 30px;
        color: var(--color-text);
        &--additional {
          margin-left: 10px;
        }
      }
      border-bottom: 1px solid var(--color-border-card);
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
    .v-card  {
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

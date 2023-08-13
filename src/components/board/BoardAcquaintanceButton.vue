<template>
  <div class="acquaintance">
    <AppButton
      variant="text"
      icon="information-outline"
      class="acquaintance__btn"
      :class="{ active: showedAcquaintanceWindow }"
      @click="toggleAcquaintanceWindow"
    />
    <DropdownWindow
      :visible="showedAcquaintanceWindow"
      :width="400"
      :height="400"
      :centering="!showTemplate"
      @hide-dropdown="showedAcquaintanceWindow = false"
    >
      <template #header>
        <div class="acquaintance__window-header">
          <h2 class="acquaintance__window-header-title">
            {{ $t("dropdown.accuaintance") }}
          </h2>
          <AppButton
            class="acquaintance__window-header--close"
            variant="text"
            icon="close"
            @click="showedAcquaintanceWindow = false"
          />
        </div>
      </template>
      <template #content>
        <div class="acquaintance__window-content">
          <AppLoader v-show="!showTemplate" inline />
          <div v-show="showTemplate" class="acquaintance__window-content-info">
            <img
              class="acquaintance__window-content-picture"
              src="/images/acquintance.webp"
              alt=""
              @load="showTemplate = true"
            />
            <div class="acquaintance__window-content-info">
              <h4 class="acquaintance__window-content-title">
                {{ $t("common.welcome") }}
              </h4>
              <p class="acquaintance__window-content-description">
                {{ $t("acquaintance.mainDescription") }}
              </p>
              <p class="acquaintance__window-content-description">
                {{ $t("acquaintance.secondaryDescription") }}
              </p>
            </div>
          </div>
          <footer v-show="showTemplate" class="acquaintance__window-footer mobile-only">
            <AppButton
              class="acquaintance__window--confirm"
              size="large"
              :title="$t('buttons.acquainted')"
              @click="showedAcquaintanceWindow = false"
            />
          </footer>
        </div>
      </template>
    </DropdownWindow>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

import AppLoader from "../UI/AppLoader.vue";
import AppButton from "../UI/AppButton.vue";
import DropdownWindow from "../container/DropdownWindow.vue";

export default defineComponent({
  components: {
    AppLoader,
    AppButton,
    DropdownWindow,
  },
  setup() {
    const showTemplate = ref(false);

    const showedAcquaintanceWindow = ref(false);

    const toggleAcquaintanceWindow = () => {
      showedAcquaintanceWindow.value = !showedAcquaintanceWindow.value;
    };

    return {
      showTemplate,
      showedAcquaintanceWindow,
      toggleAcquaintanceWindow,
    };
  },
});
</script>

<style lang="scss" scoped>
.acquaintance {
  position: relative;

  &__btn {
    padding: 0 5px;
    font-size: 20px;

    &.active {
      pointer-events: none;
      background-color: rgba($color-blue, 0.4);
    }
  }

  &__window {
    &-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 100%;
      padding: 0 5px;

      &-title {
        font-size: 20px;
        color: var(--color-text);
      }

      &--close {
        font-size: 25px;
        color: var(--color-text) !important;
        padding: 0 5px;
      }
    }

    &-content {
      display: flex;
      flex-direction: column;
      justify-content: flex-end;

      &-picture {
        width: 100%;
        height: 180px;
        display: block;
        margin: 0 auto;
      }

      &-info {
        margin-top: 5px;
        color: var(--color-text);
      }

      &-title {
        font-size: 20px;
      }

      &-description {
        margin-top: auto;
        padding: 10px 0;
        font-size: 14px;
        line-height: 18px;
      }
    }
  }

  @include mobile(max) {
    &__window {
      &-header {
        &-title {
          font-size: 17px;
        }
      }

      &-content {
        display: flex;
        flex-direction: column;

        &-picture {
          height: auto;
        }

        &-description {
          margin-top: 0;
        }
      }

      &-content-info {
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
      }

      &-footer {
        padding: 15px 10px;
      }

      &--confirm {
        color: $color-white1;
        font-size: 18px;
        text-transform: none;
        width: 100%;
      }
    }
  }
}
</style>

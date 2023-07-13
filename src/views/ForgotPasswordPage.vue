<template>
  <div class="forgot-page">
    <div class="forgot-page__window">
      <div class="forgot-page__window-header">
        <h2 class="forgot-page__window-header__title">
          {{ $t("recover.title") }}
        </h2>
        <p class="forgot-page__window-header__description">
          {{ $t("recover.description") }}
        </p>
      </div>
      <form class="forgot-page__window-content" @submit.prevent="submitForm">
        <AppInput
          v-model="email"
          :label="$t('labels.enterEmail')"
          name="userEmail"
          is-email
          required
          light-theme
          @invalid="errorEmail = true"
        />
        <AppButton class="submit-form" :title="$t('buttons.send')" type="submit" />
      </form>
      <div class="forgot-page__window-link">
        <a class="forgot-page__window-link--go-back" @click="goBack">
          <InlineSvg src="/images/icons/arrow-left.svg" />
          {{ $t("labels.goBack") }}
        </a>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";

import InlineSvg from "vue-inline-svg";
import firebaseReset from "@/helpers/firebase/firebaseReset";
import router from "@/router";

import { Route } from "@/types/enums";

export default defineComponent({
  components: {
    InlineSvg,
  },
  setup() {
    const errorEmail = ref(false);

    const email = ref("");

    const submitForm = (): void => {
      if (!errorEmail.value) {
        firebaseReset(email.value);
      }
    };

    const goBack = () => {
      if (window.history.length >= 2) {
        router.go(-1); // Navigate to previous page.
      } else {
        router.push({ name: Route.PROFILE });
      }
    };

    watch(email, (): boolean => (errorEmail.value = false));

    return {
      email,
      errorEmail,
      submitForm,
      goBack,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "@/assets/scss/mixins";
.forgot-page {
  @include auth-window;

  &__window {
    margin: 20px;
    background-color: rgba($color-dark-grey, 0.8);
    box-shadow: 0 30px 10px rgba($color-grey, 0.3);
    padding: 30px;
    max-width: 400px;
    color: $color-white1;
    border-radius: 20px;

    &-header {
      margin-bottom: 40px;

      &__title {
        font-weight: bold;
        font-size: 25px;
      }

      &__description {
        line-height: 15px;
      }
    }

    &-content {
      .c-input {
        :deep(.c-input__field) {
          border: 1px solid $color-white1;
        }
      }

      .c-button {
        margin-top: 20px;
        width: 100%;
        padding: 7px 0;
      }
    }

    &-link {
      margin-top: 20px;
      text-align: center;

      &--go-back {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        color: $color-blue;
        text-decoration: none;
        cursor: pointer;
        padding-bottom: 2px;
        border-bottom: 1px solid transparent;

        &:hover {
          border-color: inherit;
        }

        svg {
          width: 20px;
        }
      }
    }
  }

  @include mobile(max) {
    height: 100%;
    min-height: 300px;

    &__window {
      display: flex;
      flex-direction: column;
      height: 100%;
      min-width: 100%;
      border-radius: 0;
      padding: 15px 15px 80px 15px;
      margin: 0;
      min-height: 300px;

      &-header {
        margin-bottom: 40px;

        &__title {
          font-size: 18px;
        }

        &__description {
          line-height: 15px;
        }
      }

      &-link {
        margin-top: auto;

        &--go-back {
          font-size: 16px;
        }
      }

      &-content {
        min-height: 70px;

        .c-button {
          position: absolute;
          bottom: 30px;
          left: 15px;
          width: calc(100% - 30px);
          padding: 10px;
          font-size: 14px;
        }
      }
    }
  }
}
</style>

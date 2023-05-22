<template>
  <div class="acquaintance">
    <cButton
      @click="toggleAcquaintanceWindow"
      variant="text"
      icon="mdi-information-outline"
      class="acquaintance__btn"
    />
    <DropdownWindow
      :visible="showAcquaintanceWindow"
      :width="400"
      :height="500"
      @hide-dropdown="showAcquaintanceWindow = false"
    >
      <template #header>
        <div class="acquaintance__window-header">
          <h2 class="acquaintance__window-header-title">Информация</h2>
          <cButton
            class="acquaintance__window-header--close"
            variant="text"
            icon="mdi-close"
            @click="showAcquaintanceWindow = false"
          />
        </div>
      </template>
      <template #content>
        <div class="acquaintance__window-content">
          <div class="acquaintance__window-content-info">
            <img
              class="acquaintance__window-content-picture"
              src="/images/acquintance.webp"
              alt=""
            />
            <div class="acquaintance__window-content-info">
              <h4 class="acquaintance__window-content-title">Добро пожаловать</h4>
              <p class="acquaintance__window-content-description">
                Это рабочее пространство, в которое вы можете приглашать других
                пользователей, взаимодействовать с задачами и участниками доски, оставлять
                комментарии и многое другое.
              </p>
              <p class="acquaintance__window-content-description">
                В работе с доской предоставляется полная свобода действий: сколько будет
                колонок, как они будут называться, какие метки будут у задач и тому
                подобное.
              </p>
            </div>
          </div>
          <footer class="acquaintance__window-footer mobile-only">
            <cButton
              class="acquaintance__window--confirm"
              size="large"
              @click="showAcquaintanceWindow = false"
            >
              Ознакомлен
            </cButton>
          </footer>
        </div>
      </template>
    </DropdownWindow>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import DropdownWindow from "@/container/DropdownWindow.vue";

export default defineComponent({
  components: {
    DropdownWindow,
  },
  setup() {
    const showAcquaintanceWindow = ref(false);

    const toggleAcquaintanceWindow = () => {
      showAcquaintanceWindow.value = !showAcquaintanceWindow.value;
    };

    return {
      showAcquaintanceWindow,
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
        font-size: 20px;
        color: var(--color-text) !important;
        padding: 0 5px;
      }
    }
    &-content {
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      height: 100%;
      &-picture {
        width: 100%;
        height: auto;
      }
      &-info {
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
        &-description {
          margin-top: 0;
        }
      }
      &-content-info {
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        height: 100%;
      }

      &-footer {
        margin-top: auto;
        padding: 15px 0;
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

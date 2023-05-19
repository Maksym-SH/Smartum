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
        <div class="acquaintance__header-actions">
          <cButton
            class="acquaintance__header-actions--close"
            variant="text"
            icon="mdi-close"
            @click="showAcquaintanceWindow = false"
          />
        </div>
      </template>
      <template #content>
        <div class="acquaintance__content">
          <div class="acquaintance__content-info">
            <img
              class="acquaintance__content-picture"
              src="/images/acquintance.webp"
              alt=""
            />
            <div class="acquaintance__content-info">
              <h4 class="acquaintance__content-info-title">Добро пожаловать</h4>
              <p class="acquaintance__content-info-description">
                Это рабочее пространство, в которое вы можете приглашать других
                пользователей, взаимодействовать с задачами и участниками доски, оставлять
                комментарии и многое другое.
              </p>
              <p class="acquaintance__content-info-description">
                В работе с доской предоставляется полная свобода действий: сколько будет
                колонок, как они будут называться, какие метки будут у задач и тому
                подобное.
              </p>
            </div>
          </div>
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
  &__header {
    &-actions {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      height: 100%;
      &--close {
        font-size: 20px;
        color: var(--color-text) !important;
        padding: 0 5px;
      }
    }
  }
  &__content {
    display: flex;
    flex-direction: column;
    &-picture {
      width: 100%;
      height: auto;
    }
    &-info {
      color: var(--color-text);
      &-title {
        font-size: 20px;
      }
      &-description {
        margin-top: 10px;
        font-size: 14px;
        line-height: 18px;
      }
    }
  }
}
</style>

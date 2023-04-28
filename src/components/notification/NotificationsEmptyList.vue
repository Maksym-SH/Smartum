<template>
  <div class="no-notifications">
    <img 
      svg-inline
      class="no-notifications__icon"
      src="@/assets/img/icons/sad-smile.svg" 
      alt=""
    />
    <h2 class="no-notifications__title">
      Список уведомлений пуст.
    </h2>
  </div>
</template>

<style lang="scss" scoped>
.no-notifications {
  display: flex;
  align-items: center;
  flex-direction: column;
  &__icon {
    width: 70px;
    height: 70px;
    fill: var(--color-text);
  }
  &__title {
    color:var(--color-text);
    margin-top: 10px;
    font-size: 22px;
    font-weight: 500;
  }
  @include mobile(max) {
    &__icon { 
      width: 60px;
      height: 60px;
    }
    &__title {
      font-size: 18px;
    }
  }
}
</style>
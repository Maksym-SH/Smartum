<template>
  <div class="no-notifications">
    <img 
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
  }
  &__title {
    margin-top: 10px;
    font-weight: 500;
    font-size: 22px;
  }
}
</style>
<template>
  <div class="lock-chart-avaliable">
    <img class="lock-chart-avaliable__image" src="/images/icons/lock-red.svg" alt="Lock" />
    <h3 class="lock-chart-avaliable__title">
      {{ $t("charts.notAvaliable.title") }}
    </h3>
  </div>
</template>

<style lang="scss" scoped>
.lock-chart-avaliable {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
  width: 100%;
  height: 100%;
  background: rgba($color-brown, 0.2);
  border-radius: 10px;
  padding: 10px;

  &__image {
    width: 30%;
    display: block;
    min-width: 50px;
    margin: 0 auto;
  }

  &__title {
    font-size: 15px;
    font-weight: 400;
    text-align: center;
    color: var(--color-text);
    min-height: 90px;
  }
}
</style>

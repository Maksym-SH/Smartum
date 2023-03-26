<template>
  <div class="card" :class="`card-variant--${variant}`">
    <div class="card__descript" v-if="$slots.descript">
      <slot name="descript" />
    </div>
    <div class="card__wrapper" v-if="$slots.content">
      <slot name="content" />
    </div>
    <div class="card__form" v-if="$slots.form">
      <slot name="form" />
    </div>
    <div class="card__footer" v-if="$slots.footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

import { Variant } from '@/types';

export default defineComponent({
  props: {
    variant: {
      type: String as PropType<Variant>,
      default: "info"
    }
  },
})
</script>

<style lang="scss" scoped>
.card {
  padding: 60px 30px 40px 30px;
  border-radius: 10px;
  box-shadow: 0 0 5px rgba($color-black, 0.3);
  background-color: $color-white4;
  border: 2px solid transparent;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-start;
  position: relative;
  
  &__footer {
    color: $color-dark-grey;
    padding: 2px;
    text-align: center;
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    border-radius: 0 0 8px 8px;
    border-top: 2px solid transparent;
  }

  &-variant {
    &--info {
      border-color: $color-dark-blue;
 
     .card__footer {
        border-color: $color-dark-blue;
        background-color: $color-cyan;
      }
    }

    &--success {
      border-color: $color-green;
 
     .card__footer {
        border-color: $color-green;
        background-color: rgba($color-green, 0.3);
      }
    }
  }

  &__wrapper {
    margin-top: 20px;
    overflow: hidden;
    max-width: 100%;

  }

  &__form {
    padding-left: 20px;
    width: 100%;
    margin-left: auto;
    display: flex;
    flex-direction: column;
    padding-right: 20px;
    width: 50%;

    :deep(.c-input) {
      border-radius: 4px;
      border: 1px solid rgba($color-black, 0.2);
      color: $color-black;
      margin: 5px 0;
    }

    :deep(.c-button) {
      width: 100%;
      margin-top: 20px;
    }
  }

  @media (max-width: $xxl) {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    padding-top: 20px;

    &__wrapper {
      display: flex;
      margin-left: 20px;
      flex-direction: column;
    }
  
    &__form {
      width: 100%;
    }
  }

  @media (max-width: $sm) {
    display: flex;
    flex-direction: column;
    padding: 10px 10px 40px 10px;

    &__wrapper {
      margin-left: 0;
    }

    &__form {
      padding: 0;
    }
  }
}
</style>
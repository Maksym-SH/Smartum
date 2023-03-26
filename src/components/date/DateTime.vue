<template>
  <div class="date-wrapper">
    <Loader inline v-if="!showTemplate" />
    <div class="date" v-else>
      <h3 class="date__title">
        <span class="date__icon">
          <img :src="require(`@/assets/img/icons/${imageType}.svg`)" alt="" />
        </span>
        {{ welcomeType }}
      </h3>
      <div class="date__time">
        <time class="date__time--time-text">
          {{ time }}
        </time>
        <span class="date__time--date-text">
          {{ date }}
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, onUnmounted, watch } from "vue";

import { WelcomeType } from "@/types";
import { Numbers } from "@/enums";

import timeStamp from "@/helpers/date/timeStamp";

export default defineComponent({
  setup() {
    const welcomeType = ref<WelcomeType>("Добрый вечер");

    const intervalTime: any = ref(null);

    const time = ref("");

    const date = ref("");

    const imageType = computed(() => {
      if (welcomeType.value !== "Добрый вечер") return "sun";

      return "moon";
    });

    const showTemplate = computed(() => time.value && date.value);

    const loadComponentTime = Date.now();

    // 'ru-RU' only.
    watch((): string  => time.value, (): void => {
        const currentTime = Number(time.value.split("").slice(0, 2).join(""));

        if (currentTime < 16) {
          // If the time is later than 16:00.
          welcomeType.value = "Добрый день";
        }
        else {
          welcomeType.value = "Добрый вечер";
        }
      }
    );

    onMounted((): void => {
      const loadedTimeComponent = Date.now() - loadComponentTime;

      intervalTime.value = setInterval(() => {
        time.value = timeStamp(loadedTimeComponent).time;
        date.value = timeStamp(loadedTimeComponent).date;
      }, Numbers.Second);
    });

    onUnmounted((): void => clearInterval(intervalTime.value));

    return {
      time,
      date,
      welcomeType,
      imageType,
      showTemplate,
    };
  },
});
</script>

<style lang="scss" scoped>
.date {

  &-wrapper {
    position: relative;
    height: 43.2px;
    min-width: 130px;

    :deep(.c-loader) {
      .c-loader__spinner {
        svg {
          width: 40px;
          height: 40px;
        }
      }
    }
  }
  width: fit-content;
  color: $color-grey;

  &__title {
    font-size: 14px;
    display: flex;
    align-items: flex-start;
    letter-spacing: 0.3px;
    line-height: 24px;
  }

  &__icon {
    margin-right: 10px;
  }

  &__time {
    font-size: 12px;

    &--time-text {
      margin-right: 10px;
      position: relative;
      padding-right: 2px;

      &::after {
        content: "";
        position: absolute;
        display: inline-block;
        width: 2px;
        height: 2px;
        border-radius: 50%;
        background-color: $color-yellow;
        top: 50%;
        right: -5px;
      }
    }

    &--date-text {
      display: inline-block;

      &:first-letter {
        text-transform: uppercase;
      }
    }
  }
}
</style>

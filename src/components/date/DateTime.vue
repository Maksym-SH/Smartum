<template>
  <div class="date-wrapper">
    <Loader inline v-if="!showTemplate" />
    <div class="date" v-else>
      <h3 class="date__title">
        <span class="date__icon">
          <img :src="require(`@/assets/img/icons/${imageType}.svg`)" alt="" />
        </span>
        {{ dayType }}
      </h3>
      <div class="date__time">
        <span class="date__time--time-text">
          {{ time }}
        </span>
        <span class="date__time--date-text">
          {{ date }}
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  computed,
  onMounted,
  onUnmounted,
  watch,
} from "vue";

import { DayTime } from "@/types";
import timeStamp from "@/helpers/date/timeStamp";

export default defineComponent({
  setup() {
    const dayType = ref<DayTime>("Добрый вечер");

    const intervalTime: any = ref(null);

    const time = ref("");

    const date = ref("");

    const imageType = computed(() => {
      if (dayType.value !== "Добрый вечер") return "sun";

      return "moon";
    });

    const showTemplate = computed(() => time.value && date.value);

    const loadComponentTime = Date.now();

    // 'ru-RU' only
    watch(
      () => time.value,
      () => {
        if (Number(time.value.split("").slice(0, 2).join("")) < 16) {
          // If the time is later than 16:00.
          dayType.value = "Добрый день";
        }
      }
    );

    onMounted(() => {
      let loadedTime = Date.now() - loadComponentTime;
      intervalTime.value = setInterval(() => {
        time.value = timeStamp(loadedTime).time;
        date.value = timeStamp(loadedTime).date;
      }, 1000);
    });

    onUnmounted(() => clearInterval(intervalTime.value));
    return {
      time,
      date,
      dayType,
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

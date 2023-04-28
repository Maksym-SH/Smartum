<template>
  <div class="date">
    <Loader 
      v-if="!showTemplate"
      :size="40" 
      inline  
    />
    <div class="date__wrapper" v-else>
      <h3 class="date__title">
        <span class="date__icon">
          <img :src="require(`@/assets/img/icons/${imageType}.svg`)" alt="" />
        </span>
        {{ WelcomeText }}
      </h3>
      <div class="date__timestamp">
        <time class="date__timestamp--time">
          {{ time }}
        </time>
        <span class="date__timestamp--date">
          {{ date }}
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, onUnmounted, watch } from "vue";
import { WelcomeText, Icon } from "@/types";
import { Numbers } from "@/enums";

import timestamp from "@/helpers/date/timestamp";

export default defineComponent({
  setup() {
    const WelcomeText = ref<WelcomeText>("Добрый вечер");

    const updateTimeInterval = ref<ReturnType<typeof setInterval> | null>(null);

    const time = ref("");
    const date = ref("");

    const imageType = computed((): Icon => {
      if (WelcomeText.value !== "Добрый вечер") return "sun";

      return "moon";
    });

    const showTemplate = computed(() => time.value && date.value);

    // Changing text depending on the time of day.
    watch((): string  => time.value, (): void => {
      const currentTime = Number(time.value.split("").slice(0, 2).join("")); // Between 0 - 23.

      if (currentTime < Numbers.EveningRU && currentTime > Numbers.MorningRU) {
        // If the time is later than 16:00 and later than 4:00.
        WelcomeText.value = "Добрый день";
      }
      else {
        WelcomeText.value = "Добрый вечер";
      }
    });

    onMounted((): void => {
      updateTimeInterval.value = setInterval((): void => {
        const currentDate = new Date();

        time.value = timestamp(currentDate).time;
        date.value = timestamp(currentDate).date;
      }, Numbers.Second);
    });

    onUnmounted((): void => {
      if(updateTimeInterval.value) {
        clearInterval(updateTimeInterval.value)
      }
    });

    return {
      time,
      date,
      WelcomeText,
      imageType,
      showTemplate,
    };
  },
});
</script>

<style lang="scss" scoped>
.date {
  width: 235px;
  color: var(--color-text);
  text-align: center;
  &-wrapper {
    position: relative;
    height: 43.2px;
    min-width: 130px;
  }
  &__title {
    display: flex;
    align-items: flex-start;
    font-size: 14px;
    letter-spacing: 0.3px;
    line-height: 24px;
  }
  &__icon {
    margin-right: 10px;
  }
  &__timestamp {
    font-size: 12px;
    &--time {
      position: relative;
      padding-right: 2px;
      margin-right: 10px;
      &::after {
        content: "";
        position: absolute;
        top: 50%;
        right: -5px;
        display: inline-block;
        width: 2px;
        height: 2px;
        border-radius: 50%;
        background-color: $color-yellow;
      }
    }
    &--date {
      display: inline-block;
      &:first-letter {
        text-transform: uppercase;
      }
    }
  }
}
</style>

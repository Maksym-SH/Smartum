<template>
  <div class="date">
    <div v-if="showTemplate" class="date__wrapper">
      <h3 class="date__title">
        <span class="date__icon">
          <img
            class="date__icon-picture"
            :src="`/images/icons/${imageType}.svg`"
            alt=""
          />
        </span>
        {{ welcomeText }}
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
import { computed, defineComponent, onMounted, onUnmounted, ref, watch } from "vue";
import type { Icon, WelcomeText } from "@/types/types";
import { Numbers } from "@/types/enums";

import timestamp from "@/helpers/dateTime/stamp";

export default defineComponent({
  setup() {
    const welcomeText = ref<WelcomeText>("Добрый вечер");

    const updateTimeInterval = ref<ReturnType<typeof setInterval> | null>(null);

    const time = ref("");
    const date = ref("");

    const imageType = computed((): Icon => {
      if (welcomeText.value !== "Добрый вечер") return "sun";

      return "moon";
    });

    const showTemplate = computed((): boolean => Boolean(time.value && date.value));

    // Changing text depending on the time of day.
    watch(
      (): string => time.value,
      (): void => {
        // Get current hour between 0 - 23.
        const currentTime = time.value;
        const currentTimeHours = Number(currentTime.split("").slice(0, 2).join(""));

        // If the time is later than 16:00 and later than 6:00.
        if (
          currentTimeHours < Numbers.EveningRU &&
          currentTimeHours > Numbers.MorningRU
        ) {
          welcomeText.value = "Добрый день";
        } else {
          welcomeText.value = "Добрый вечер";
        }
      }
    );

    onMounted((): void => {
      updateTimeInterval.value = setInterval((): void => {
        const currentDate = new Date();

        time.value = timestamp(currentDate).time;
        date.value = timestamp(currentDate).date;
      }, Numbers.Second);
    });

    onUnmounted((): void => {
      if (updateTimeInterval.value) clearInterval(updateTimeInterval.value);
    });

    return {
      time,
      date,
      welcomeText,
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
      margin-right: 10px;
      min-width: 51px;
      display: inline-block;
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

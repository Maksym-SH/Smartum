<template>
  <div class="date">
    <div v-if="showTemplate" class="date__wrapper">
      <h3 class="date__title">
        <span class="date__icon">
          <img class="date__icon-picture" :src="`/images/icons/${imageType}.svg`" alt="" />
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

import i18n from "@/i18n";
import useCurrentLanguage from "@/composables/useCurrentLanguage";
import timestamp from "@/helpers/dateTime/stamp";

import type { Language } from "@/types/enums";
import { Numbers } from "@/types/enums";
import type { TimeIcon } from "@/types";

export default defineComponent({
  setup() {
    const { t } = i18n.global;

    const { i18nLocale } = useCurrentLanguage();

    const welcomeText = ref(t("time.morning"));

    const updateTimeInterval = ref<ReturnType<typeof setInterval> | null>(null);

    const time = ref("");
    const date = ref("");

    const imageType = ref<TimeIcon>("");

    const showTemplate = computed((): boolean => Boolean(time.value && date.value));

    // Changing text depending on the time of day.
    watch(time, (): void => {
      // Get current hour between 0 - 23.
      const currentTimeHours = new Date().getHours();

      // If the time is later than 16:00 || 4 pm and later than 6:00 || 6 pm.
      if (
        currentTimeHours < Numbers.EVENING_TIME &&
        currentTimeHours > Numbers.MORNING_TIME
      ) {
        welcomeText.value = t("time.morning");
        imageType.value = "sun";
      } else {
        welcomeText.value = t("time.evening");
        imageType.value = "moon";
      }
    });

    onMounted((): void => {
      updateTimeInterval.value = setInterval((): void => {
        const currentDate = new Date();

        time.value = timestamp(currentDate, i18nLocale.value as Language).time;
        date.value = timestamp(currentDate, i18nLocale.value as Language).date;
      }, Numbers.SECOND);
    });

    onUnmounted((): void => {
      if (updateTimeInterval.value) {
        clearInterval(updateTimeInterval.value);
      }
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
  position: relative;
  color: var(--color-text);
  padding-left: 25px;

  &__title {
    font-size: 14px;
    letter-spacing: 0.3px;
    line-height: 24px;
  }

  &__icon {
    position: absolute;
    left: 0;
    margin-right: 10px;
  }

  &__timestamp {
    font-size: 12px;
    white-space: nowrap;

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

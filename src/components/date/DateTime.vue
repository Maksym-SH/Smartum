<template>
  <div class="date">
    <Loader :size="40" inline v-if="!showTemplate" />
    <div class="date__wrapper" v-else>
      <h3 class="date__title">
        <span class="date__icon">
          <img :src="require(`@/assets/img/icons/${imageType}.svg`)" alt="" />
        </span>
        {{ Welcome }}
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
import { Welcome, Icon } from "@/types";
import { Numbers } from "@/enums";
import timestamp from "@/helpers/date/timestamp";

export default defineComponent({
  setup() {
    const Welcome = ref<Welcome>("Добрый вечер");

    const intervalTime = ref<ReturnType<typeof setInterval> | null>(null);

    const time = ref("");
    const date = ref("");

    const imageType = computed((): Icon => {
      if (Welcome.value !== "Добрый вечер") return "sun";

      return "moon";
    });

    const showTemplate = computed(() => time.value && date.value);

    // 'ru-RU' only.
    watch((): string  => time.value, (): void => {
        const currentTime = Number(time.value.split("").slice(0, 2).join(""));

        if (currentTime < Numbers.EveningRU && currentTime > Numbers.MorningRU) {
          // If the time is later than 16:00 and later than 4:00.
          Welcome.value = "Добрый день";
        }
        else {
          Welcome.value = "Добрый вечер";
        }
      }
    );

    onMounted((): void => {
      intervalTime.value = setInterval((): void => {
        const currentDate = new Date();

        time.value = timestamp(currentDate).time;
        date.value = timestamp(currentDate).date;
      }, Numbers.Second);
    });

    onUnmounted((): void => {
      if(intervalTime.value) {
        clearInterval(intervalTime.value)
      }
    });

    return {
      time,
      date,
      Welcome,
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
    font-size: 14px;
    display: flex;
    align-items: flex-start;
    letter-spacing: 0.3px;
    line-height: 24px;
  }
  &__icon {
    margin-right: 10px;
  }
  &__timestamp {
    font-size: 12px;
    &--time {
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
    &--date {
      display: inline-block;
      &:first-letter {
        text-transform: uppercase;
      }
    }
  }
}
</style>

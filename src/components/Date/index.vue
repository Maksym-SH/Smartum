<template>
  <div class="date-wrapper">
    <c-loader inline v-if="!showTemplate" />
    <div class="date" v-else>
      <h3 class="date__title">
        <span class="date__icon">
          <img :src="require(`@/assets/img/icons/${ imageType }.svg`)" alt="">
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
import { defineComponent, ref, computed, onMounted, onUnmounted, watch } from "vue";
import { DayTime } from "@/types/index";
import timeStamp from "./use/timeStamp";
export default defineComponent({
  setup() {
    const dayType = ref<DayTime>("Добрый вечер");
 
    const intervalTime: any = ref(""); 
    const time = ref("");
    const date = ref("");
    const imageType = computed(() => {
      if(dayType.value !== "Добрый вечер") return "sun"
      return "moon"
    })

    const showTemplate = computed(() => time.value && date.value);

    // 'ru-RU' only
    watch(() => time.value, () => {
       if ( Number(time.value.split('').slice(0,2).join('')) < 16 ) { // If the time is later than 16:00.
        dayType.value = "Добрый день"
      }
    })
    onMounted(() => {
      intervalTime.value = setInterval(() => {
        time.value = timeStamp().time;
        date.value = timeStamp().date;
      }, 1000)
    }) 
    onUnmounted(()=> clearInterval(intervalTime.value))
    return {
      time,
      date,
      dayType,
      imageType,
      showTemplate
    }
  }
})
</script>

<style lang="scss" src="./index.scss"></style>
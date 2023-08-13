<template>
  <div class="statistics-tab">
    <ChartActivity
      v-if="showActivityChart"
      :user-visits="statisticsStore.statistics.visits"
    />
    <ChartBoardsActivity
      v-if="showBoardsActivityChart"
      :activity="statisticsStore.statistics.boardActivity"
    />
    <ChartNotAvaliable v-else-if="showNotAvaliableChartMessage" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from "vue";
import useStores from "@/composables/useStores";
import useCurrentLanguage from "@/composables/useCurrentLanguage";
import { CreateDebounce } from "@/helpers/methods";

import ChartActivity from "@/components/charts/ChartActivity.vue";
import ChartBoardsActivity from "@/components/charts/ChartBoardsActivity.vue";
import ChartNotAvaliable from "@/components/access/ChartNotAvaliable.vue";

export default defineComponent({
  components: {
    ChartActivity,
    ChartBoardsActivity,
    ChartNotAvaliable,
  },
  setup() {
    const { statisticsStore } = useStores();
    const { i18nLocale } = useCurrentLanguage();
    const reRender = ref(false);

    const debounce = CreateDebounce(0);
    watch(i18nLocale, () => {
      reRender.value = true;

      debounce(() => (reRender.value = false));
    });

    const showActivityChart = computed(() => {
      return statisticsStore.statistics.visits.length && !reRender.value;
    });

    const showBoardsActivityChart = computed(() => {
      return (
        statisticsStore.statistics.boardActivity.some((item) => item > 0) && !reRender.value
      );
    });

    const showNotAvaliableChartMessage = computed(() => {
      return statisticsStore.statisticLoaded && !reRender.value;
    });

    return {
      reRender,
      showActivityChart,
      showBoardsActivityChart,
      showNotAvaliableChartMessage,
      statisticsStore,
    };
  },
});
</script>

<style lang="scss" scoped>
.statistics-tab {
  display: grid;
  grid-template-columns: 640px 310px;

  @include responsive($xxl, max) {
    grid-template-columns: 500px 215px;
  }

  @include responsive($xl, max) {
    grid-template-columns: 485px 215px;
  }

  @include tablet(max) {
    grid-template-columns: 1fr;
    grid-template-rows: auto 300px;
    gap: 20px;
    justify-items: center;

    .lock-chart-avaliable {
      max-width: 300px;
      padding: 0;
    }
  }
}
</style>

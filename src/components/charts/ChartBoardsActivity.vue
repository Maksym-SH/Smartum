<template>
  <div class="chart-boards">
    <canvas ref="canvasRef"/>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from "vue";

import { useI18n } from "vue-i18n";
import Chart from "chart.js/auto";
import ChartColors from "@/helpers/colors/colorCharts";

import type { PropType } from "vue";
import type { IStatistics } from "@/types/interfaces/statistics";

export default defineComponent({
  props: {
    activity: {
      type: Object as PropType<IStatistics["boardActivity"]>,
      required: true,
    },
  },
  setup(props) {
    const { t } = useI18n();
    const canvasRef = ref<HTMLCanvasElement>();

    const colors = ChartColors(6); // Take the first 6 colors.
    const backgrounds = colors.map((item) => item.background);
    const borders = colors.map((item) => item.border);

    const subtitleActionText = computed(() => {
      if (matchMedia("(pointer:fine)").matches) {
        return t("buttons.hover");
      }

      return t("buttons.tap");
    });

    const buildChart = (): void => {
      if (canvasRef.value) {
        new Chart(canvasRef.value, {
          type: "doughnut",
          data: {
            labels: [
              t("charts.boardActive.tooltip.boards"),
              t("charts.boardActive.tooltip.comments"),
              t("charts.boardActive.tooltip.users"),
              t("charts.boardActive.tooltip.tasks"),
              t("charts.boardActive.tooltip.columns"),
              t("charts.boardActive.tooltip.taskMoved"),
            ],
            datasets: [
              {
                data: props.activity,
                label: "",
                backgroundColor: backgrounds,
                borderColor: borders,
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            scales: {
              y: {
                display: false,
              },
            },
            plugins: {
              legend: {
                display: false,
              },
              title: {
                font: {
                  size: 16,
                },
                padding: 0,
                display: true,
                text: t("charts.boardActive.title"),
              },
              subtitle: {
                display: true,
                padding: 10,
                text: t("charts.boardActive.subtitle", {
                  action: subtitleActionText.value,
                }),
              },
            },
          },
        });
      }
    };

    onMounted(() => {
      buildChart();
    });

    return {
      canvasRef,
    };
  },
});
</script>

<style lang="scss" scoped>
.chart-boards {
  max-width: 310px;

  @include tablet(max) {
    max-width: 500px;
  }
}
</style>

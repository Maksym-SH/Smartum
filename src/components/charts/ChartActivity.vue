<template>
  <div class="chart-activity">
    <canvas ref="canvasRef"/>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";

import { useI18n } from "vue-i18n";
import Chart from "chart.js/auto";
import ChartColors from "@/helpers/colors/colorCharts";
import { GetBetweenDateString } from "@/helpers/dateTime/getDate";

import type { PropType } from "vue";
import type { IChartVisit } from "@/types/interfaces/statistics";
import type { IServerDate } from "@/types/interfaces";
import { Numbers } from "@/types/enums";

export default defineComponent({
  props: {
    userVisits: {
      type: Array as PropType<IChartVisit[]>,
      required: true,
    },
  },
  setup(props) {
    const { t } = useI18n();
    const canvasRef = ref<HTMLCanvasElement>();

    const colors = ChartColors(6); // Take the first 6 colors.
    const backgrounds = colors.map((item) => item.background);
    const borders = colors.map((item) => item.border);

    const getChartLabels = () => {
      const propsDates = Array.from(props.userVisits);

      const chartLabels = propsDates.map((visit) => {
        if ((visit.date as IServerDate).seconds) {
          visit.date = new Date((visit.date as IServerDate).seconds * Numbers.SECOND);
          visit.date.setDate(visit.date.getDate());
        }

        return GetBetweenDateString(visit.date as Date, false);
      });

      return chartLabels;
    };

    const buildChart = (): void => {
      if (canvasRef.value) {
        new Chart(canvasRef.value, {
          type: "bar",
          data: {
            labels: getChartLabels(),
            datasets: [
              {
                maxBarThickness: 70,
                label: t("charts.visits.tooltip"),
                data: props.userVisits.map((item) => item.visitCount),
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
                min: 0,
                ticks: {
                  stepSize: 1,
                },
              },
            },
            plugins: {
              legend: {
                display: false,
              },
              title: {
                display: true,
                font: {
                  size: 16,
                },
                text: t("charts.visits.title"),
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
.chart-activity {
  @include responsive($xxl, min) {
    width: 640px;
    height: 320px;
  }

  @include mobile(max) {
    width: 460px;
    height: 240px;
    display: flex;
    justify-content: center;
  }

  @include responsive($us, max) {
    max-width: 95vw;
    height: auto;
  } 
}
</style>

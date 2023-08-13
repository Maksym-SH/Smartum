import type { IChartColor } from "@/types/interfaces/statistics";

export default function ChartColors(count?: number): IChartColor[] {
  const colorOptions: IChartColor[] = [
    {
      background: "rgba(255, 99, 132, 0.2)",
      border: "rgb(255, 99, 132)",
    },
    {
      background: "rgba(255, 159, 64, 0.2)",
      border: "rgb(255, 159, 64)",
    },
    {
      background: "rgba(255, 205, 86, 0.2)",
      border: "rgb(255, 205, 86)",
    },
    {
      background: "rgba(75, 192, 192, 0.2)",
      border: "rgb(75, 192, 192)",
    },
    {
      background: "rgba(54, 162, 235, 0.2)",
      border: "rgb(54, 162, 235)",
    },
    {
      background: "rgb(153, 102, 255, 0.2)",
      border: "rgb(153, 102, 255)",
    },
  ];

  if (count && count <= colorOptions.length) {
    return colorOptions.slice(0, count);
  }

  return colorOptions;
}

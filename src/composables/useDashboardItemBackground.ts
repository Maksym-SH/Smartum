import { Colors } from "@/types/enums";
import type { IBackgroundDashboard } from "@/types/interfaces/colors";

export default function useDashboardItemBackgroundTemplate(): IBackgroundDashboard {
  return {
    photos: {
      forest: `${import.meta.env.BASE_URL}images/dashboardTemplates/forest.jpeg`,
      lake: `${import.meta.env.BASE_URL}images/dashboardTemplates/lake.jpeg`,
      lakeWithForest: `${
        import.meta.env.BASE_URL
      }images/dashboardTemplates/lakeWithForest.jpeg`,
      mountains: `${import.meta.env.BASE_URL}images/dashboardTemplates/mountains.jpeg`,
      river: `${import.meta.env.BASE_URL}images/dashboardTemplates/river.jpeg`,
    },
    gradients: {
      backgroundBlue: Colors.GRADIENT_BLUE,
      backgroundBluePink: Colors.GRADIENT_BLUE_PINK,
      backgrondGreen: Colors.GRADIENT_GREEN,
      backgroundLightBlue: Colors.GRADIENT_LIGHT_BLUE,
      backgrondGray: Colors.GRADIENT_GRAY,
      backgroundRedBlue: Colors.GRADIENT_RED_BLUE,
    },
  };
}

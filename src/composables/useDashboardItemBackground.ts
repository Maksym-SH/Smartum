import { Colors } from "@/types/enums";
import type { IBackgroundDashboard } from "@/types/interfaces/colors";

export default function useDashboardItemBackgroundTemplate(): IBackgroundDashboard {
  const baseUrl = import.meta.env.BASE_URL;

  return {
    photos: {
      forest: `${baseUrl}images/dashboardTemplates/forest.jpeg`,
      lake: `${baseUrl}images/dashboardTemplates/lake.jpeg`,
      lakeWithForest: `${baseUrl}images/dashboardTemplates/lakeWithForest.jpeg`,
      mountains: `${baseUrl}images/dashboardTemplates/mountains.jpeg`,
      river: `${baseUrl}images/dashboardTemplates/river.jpeg`,
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

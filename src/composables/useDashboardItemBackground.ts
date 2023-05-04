import { Colors } from "@/enums";
import { IBackgroundDashboard } from "@/interfaces";

const useDashboardItemBackgroundTemplate = (): IBackgroundDashboard => {
  return {
    photos: {
      forest: import.meta.env.BASE_URL + "images/dashboardTemplates/forest.jpeg",
      lake: import.meta.env.BASE_URL + "images/dashboardTemplates/lake.jpeg",
      lakeWithForest: import.meta.env.BASE_URL + "images/dashboardTemplates/lakeWithForest.jpeg",
      mountains: import.meta.env.BASE_URL + "images/dashboardTemplates/mountains.jpeg",
      river: import.meta.env.BASE_URL + "images/dashboardTemplates/river.jpeg",
    },
    gradients: {
      backgroundBlue: Colors.GradientBlue,
      backgroundBluePink: Colors.GradientBluePink,
      backgrondGreen: Colors.GradientGreen,
      backgroundLightBlue: Colors.GradientLightBlue,
      backgrondGray: Colors.GradientGray,
      backgroundRedBlue: Colors.GradientRedBlue
    }
  }
}

export default useDashboardItemBackgroundTemplate;
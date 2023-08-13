import useCommonStore from "@/store/common";
import useConfigurationStore from "@/store/configuration";
import useNotificationStore from "@/store/notifications";
import useUserStore from "@/store/user";
import useDashboardStore from "@/store/dashboard";
import usestatisticsStore from "@/store/statistics";

export default function useStore() {
  const commonStore = useCommonStore();
  const userStore = useUserStore();
  const notificationStore = useNotificationStore();
  const configurationStore = useConfigurationStore();
  const dashboardStore = useDashboardStore();
  const statisticsStore = usestatisticsStore();

  return {
    commonStore,
    userStore,
    notificationStore,
    configurationStore,
    dashboardStore,
    statisticsStore,
  };
}

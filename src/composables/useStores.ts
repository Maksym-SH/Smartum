import useCommonStore from "@/store/common";
import useConfigurationStore from "@/store/configuration";
import useNotificationStore from "@/store/notifications";
import useUserStore from "@/store/user";
import useDashboardStore from "@/store/dashboard";

export default function useStore() {
  const commonStore = useCommonStore();
  const userStore = useUserStore();
  const notificationStore = useNotificationStore();
  const configurationStore = useConfigurationStore();
  const dashboardStore = useDashboardStore();

  return {
    commonStore,
    userStore,
    notificationStore,
    configurationStore,
    dashboardStore,
  };
}

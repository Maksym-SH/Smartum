import "vue-router";

type TabName =
  | "Profile"
  | "Notifications"
  | "Reports"
  | "Configuration"
  | "Dashboard"
  | "Statistics";

declare module "vue-router" {
  interface RouteMeta {
    protected?: boolean;
    notAuthorized?: boolean;
    tabName?: TabName;
  }
}

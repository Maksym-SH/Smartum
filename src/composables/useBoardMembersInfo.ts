import { computed } from "vue";

import useStores from "./useStores";

export default function useBoardMembersInfo() {
  const { dashboardStore } = useStores();

  const memebersIds = computed((): string[] => {
    return dashboardStore.boardMembers.map((member) => member.uid);
  });

  return {
    memebersIds,
  };
}

import { defineStore } from "pinia";
import { ref } from "vue";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { notify } from "@kyvg/vue3-notification";
import { database } from "@/helpers/firebase/firebaseInitialize";
import { DataCollection } from "@/types/enums";
import type { IWorkingBoardItem } from "@/types/interfaces";
import type { ErrorCode } from "@/types/types";

import ShowErrorMessage from "@/helpers/firebase/firebaseErrorMessage";
import useStores from "@/composables/useStores";

const useDashboardStore = defineStore("dashboard", () => {
  const { commonStore, userStore } = useStores();

  const allDashboards = ref<IWorkingBoardItem[]>([]);

  const setAllDashboard = (dashboards: IWorkingBoardItem[]): void => {
    allDashboards.value = dashboards;
  };
  const addNewBoard = (item: IWorkingBoardItem): void => {
    allDashboards.value.push(item);
  };
  const clearList = (): void => {
    allDashboards.value = [];
  };
  const createNewWorkingBoard = (
    board: IWorkingBoardItem,
    unicID: string
  ): Promise<IWorkingBoardItem> => {
    const dashboardRef = doc(database, DataCollection.Dashboard, unicID);
    commonStore.setLoadingStatus(true);

    return new Promise((resolve, reject) => {
      getDoc(dashboardRef).then((docSnap) => {
        if (docSnap.exists()) {
          const currentCollectionDasboard = allDashboards.value;
          currentCollectionDasboard.push(board);

          updateDoc(dashboardRef, "collection", currentCollectionDasboard)
            .then(() => {
              resolve(board);
            })
            .catch((error: ErrorCode) => {
              ShowErrorMessage(error);
              reject(error);
            })
            .finally(() => commonStore.setLoadingStatus(false));
        } else {
          setDoc(doc(database, DataCollection.Dashboard, unicID), {
            collection: [board],
          })
            .then(() => {
              addNewBoard(board);
              resolve(board);
            })
            .catch((error: ErrorCode) => {
              ShowErrorMessage(error);
              reject(error);
            })
            .finally(() => commonStore.setLoadingStatus(false));
        }
      });
    });
  };
  const getAllWorkingBoards = (unicID: string): Promise<IWorkingBoardItem[]> => {
    const dashboardRef = doc(database, DataCollection.Dashboard, unicID);

    return new Promise((resolve, reject) => {
      getDoc(dashboardRef)
        .then((dashboards) => {
          const allDashboards = dashboards.data()?.collection;
          resolve(allDashboards as IWorkingBoardItem[]);
        })
        .catch((error: ErrorCode) => {
          ShowErrorMessage(error);
          reject(error);
        });
    });
  };
  const updateAllWorkingBoards = (
    unicID: string,
    board: IWorkingBoardItem[]
  ): Promise<void> => {
    const dashboardRef = doc(database, DataCollection.Dashboard, unicID);

    commonStore.setLoadingStatus(true);

    return new Promise((resolve, reject) => {
      updateDoc(dashboardRef, {
        collection: board,
      })
        .then(() => {
          resolve();
        })
        .catch((error) => {
          ShowErrorMessage(error);
          reject(error);
        });
    });
  };

  const getWorkingBoardItem = (
    unicID: string,
    joinCode: string
  ): Promise<IWorkingBoardItem> => {
    commonStore.setLoadingStatus(true);
    return new Promise((resolve, reject) => {
      getAllWorkingBoards(unicID).then(async (boards) => {
        const currentBoard = boards?.find((item) => item.joinCode === joinCode);

        // Load avatars.
        await userStore.getAllUserAvatars().then((list) => {
          if (currentBoard?.members) {
            currentBoard.members.map((user) => {
              return (user.avatarParams!.url = list.find((item) =>
                item.includes(user.uid as string)
              ) as string);
            });
          }
        });

        if (currentBoard) {
          resolve(currentBoard);
        } else {
          reject(new Error("Not found"));

          notify({
            title: "Рабочая доска недоступна!",
            text: "Текущая доска не существует или код приглашения неверный.",
            type: "error",
          });
        }

        commonStore.setLoadingStatus(false);
      });
    });
  };

  return {
    allDashboards,
    clearList,
    setAllDashboard,
    addNewBoard,
    createNewWorkingBoard,
    getAllWorkingBoards,
    updateAllWorkingBoards,
    getWorkingBoardItem,
  };
});

export default useDashboardStore;

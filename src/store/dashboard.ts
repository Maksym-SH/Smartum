import { defineStore } from "pinia";
import { ref } from "vue";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { notify } from "@kyvg/vue3-notification";
import { database } from "@/helpers/firebase/firebaseInitialize";
import { DataCollection } from "@/types/enums";
import type { IWorkingBoardItem, IWorkingBoardResolve } from "@/types/interfaces";
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
    board: IWorkingBoardItem[],
    showLoading = true
  ): Promise<void> => {
    const dashboardRef = doc(database, DataCollection.Dashboard, unicID);

    commonStore.setLoadingStatus(showLoading);

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
        })
        .finally(() => commonStore.setLoadingStatus(showLoading));
    });
  };

  const getWorkingBoardItem = (
    unicID: string,
    joinCode: string
  ): Promise<IWorkingBoardResolve> => {
    commonStore.setLoadingStatus(true);
    return new Promise((resolve, reject) => {
      getAllWorkingBoards(unicID).then(async (boards) => {
        const currentBoard = boards?.find((item) => item.joinCode === joinCode);

        if (currentBoard) {
          // Load users.
          await userStore.getUsersList(true, false).then((users) => {
            const membersID = currentBoard.members.map((item) => item.uid);

            const sortedUsersAsMembers = users.filter((user) =>
              membersID.includes(user.uid)
            );

            sortedUsersAsMembers.forEach((item) => {
              const member = currentBoard.members.find((user) => user.uid === item.uid);
              if (member) {
                item.role = member.role ?? "";
                item.invited = member.invited ?? false;
              }
            });

            resolve({
              value: currentBoard,
              members: sortedUsersAsMembers,
            });
          });
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

  const updateWorkingBoard = (
    updatedBoard: IWorkingBoardItem,
    showLoading = true
  ): Promise<any> => {
    const responseForAllMembers = updatedBoard.members.map((user) => {
      if (!user.invited) {
        const userID = user.uid as string;

        getAllWorkingBoards(userID).then((list) => {
          if (list) {
            const boardToUpdate = list.find(
              (board) => board.joinCode === updatedBoard.joinCode
            );

            if (boardToUpdate) {
              Object.assign(boardToUpdate, updatedBoard);

              updateAllWorkingBoards(userID, list, showLoading);
            }
          }
        });
      }
    });
    return new Promise((resolve, reject) => {
      Promise.all(responseForAllMembers)
        .then(() => {
          resolve(updatedBoard);
        })
        .catch((error: ErrorCode) => {
          ShowErrorMessage(error);
          reject(error);
        })
        .finally(() => commonStore.setLoadingStatus(false));
    });
  };

  const joinWorkingBoard = (
    { uid, joinCode }: Pick<IWorkingBoardItem, "uid" | "joinCode">,
    unicID: string
  ) => {
    getWorkingBoardItem(uid, joinCode).then((board) => {
      if (board) {
        // Update data for other users.
        getAllWorkingBoards(board.value.uid).then((list) => {
          const boardToUpdate = list.find((board) => board.uid === uid);

          if (boardToUpdate) {
            const invitedMember = boardToUpdate.members.find(
              (member) => member.uid === unicID
            );
            if (invitedMember) {
              invitedMember.role = "Участник";
              delete invitedMember.invited;

              updateWorkingBoard(boardToUpdate);
            }

            // Create new board for invited user.
            createNewWorkingBoard(boardToUpdate, unicID).then(() => {
              notify({
                title: "Успешно!",
                text: "Вы успешно присоединились к рабочему пространству!",
              });
            });
          }
        });
      }
    });
  };

  return {
    allDashboards,
    clearList,
    setAllDashboard,
    addNewBoard,
    createNewWorkingBoard,
    getAllWorkingBoards,
    updateWorkingBoard,
    updateAllWorkingBoards,
    getWorkingBoardItem,
    joinWorkingBoard,
  };
});

export default useDashboardStore;

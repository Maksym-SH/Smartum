import { defineStore } from "pinia";
import { ref } from "vue";
import { deleteDoc, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { notify } from "@kyvg/vue3-notification";
import { database } from "@/helpers/firebase/firebaseInitialize";
import { DataCollection, NotificationType } from "@/types/enums";
import type {
  IWorkingBoardItem,
  IWorkingBoardMember,
  IWorkingBoardResolve,
} from "@/types/interfaces";
import type { BoardRole, ErrorCode } from "@/types/types";

import ShowErrorMessage from "@/helpers/firebase/firebaseErrorMessage";
import useStores from "@/composables/useStores";
import router from "@/router";
import useNewNotificationContent from "@/composables/useNotificationContent";

const useDashboardStore = defineStore("dashboard", () => {
  const { commonStore, userStore, notificationStore } = useStores();

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
        .finally(() => commonStore.setLoadingStatus(false));
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
          await userStore.getUsersList(true, false).then(async (users) => {
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

            const dashboardInfo = await membersExist({
              value: currentBoard,
              members: sortedUsersAsMembers,
            });

            resolve(dashboardInfo);
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
  ): Promise<IWorkingBoardItem> => {
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
        getAllWorkingBoards(uid).then((list) => {
          const boardToUpdate = list.find((board) => board.joinCode === joinCode);

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

  const leaveWorkingBoard = (
    member: IWorkingBoardMember,
    fromBoard: IWorkingBoardItem
  ): Promise<void> => {
    const memberID = member.uid;

    const leavedMemberIndex = fromBoard.members.findIndex(
      (user) => user.uid === memberID
    );

    if (leavedMemberIndex !== -1) {
      fromBoard.members.splice(leavedMemberIndex, 1); // Remove user.

      const firstInvitedUser = fromBoard.members[0];

      if (fromBoard.uid === member.uid && firstInvitedUser) {
        fromBoard.uid = firstInvitedUser.uid; // Set as admin the first invited user.
        firstInvitedUser.role = "Администратор";

        const notification = useNewNotificationContent(
          NotificationType.SetAdmin,
          fromBoard.title,
          fromBoard
        );
        notificationStore.sendNotificationToUser(firstInvitedUser, notification);
      }
    }

    return new Promise(async (resolve, reject) => {
      try {
        await updateWorkingBoard(fromBoard);

        const myBoards = await getAllWorkingBoards(memberID);

        const myBoardIndex = myBoards.findIndex(
          (board) => board.joinCode === fromBoard.joinCode
        );

        myBoards.splice(myBoardIndex, 1);

        await updateAllWorkingBoards(memberID, myBoards);
        router.push({ name: "Dashboard" });

        // Delete local board.
        if (allDashboards.value.length) {
          allDashboards.value.splice(myBoardIndex, 1);
        }

        resolve();
      } catch (error: unknown) {
        ShowErrorMessage(error as ErrorCode);
        reject(error);
      } finally {
        commonStore.setLoadingStatus(false);
      }
    });
  };

  const membersExist = async (
    boardInfo: IWorkingBoardResolve
  ): Promise<IWorkingBoardResolve> => {
    const loadedMembers = boardInfo.members;

    const savedMembers = boardInfo.value.members;

    if (loadedMembers.length !== savedMembers.length) {
      const exist: IWorkingBoardMember[] = loadedMembers.map((item) => {
        return {
          role: item.role as BoardRole,
          uid: item.uid,
          invited: item?.invited,
        };
      });

      const adminExist = exist.some((member) => member.role === "Администратор");

      // Set new admin board for first invited user.
      if (!adminExist) {
        const newAdmin = exist[0];
        newAdmin.role = "Администратор";

        // Set for saved members.
        boardInfo.members[0].role = "Администратор";

        const newAdminNotification = useNewNotificationContent(
          NotificationType.SetAdmin,
          boardInfo.value.title,
          boardInfo.value
        );
        notificationStore.sendNotificationToUser(newAdmin, newAdminNotification);
      }

      boardInfo.value.members = exist;

      await updateWorkingBoard(boardInfo.value);

      return boardInfo;
    } else {
      return boardInfo;
    }
  };

  const deleteAllBoards = (unicID: string): Promise<void> => {
    const dashboardRef = doc(database, DataCollection.Dashboard, unicID);

    commonStore.setLoadingStatus(true);
    return new Promise((resolve, reject) => {
      deleteDoc(dashboardRef)
        .then(() => {
          allDashboards.value = [];
          resolve();
        })
        .catch((error: ErrorCode) => {
          ShowErrorMessage(error);
          reject(error);
        })
        .finally(() => commonStore.setLoadingStatus(false));
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
    leaveWorkingBoard,
    deleteAllBoards,
  };
});

export default useDashboardStore;

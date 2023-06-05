import { defineStore } from "pinia";
import { ref } from "vue";
import { deleteDoc, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { notify } from "@kyvg/vue3-notification";
import { database, RTDatabase } from "@/helpers/firebase/firebaseInitialize";
import { child, get, onValue, ref as Refference, set, update } from "firebase/database";
import { DataCollection, NotificationType, UserRole } from "@/types/enums";
import type {
  IUserForList,
  IWorkingBoardItem,
  IWorkingBoardMember,
  IWorkingBoardResolve,
} from "@/types/interfaces";
import type { ErrorCode } from "@/types/types";

import ShowErrorMessage from "@/helpers/firebase/firebaseErrorMessage";
import useStores from "@/composables/useStores";
import router from "@/router";
import useNewNotificationContent from "@/composables/useNotificationContent";

const useDashboardStore = defineStore("dashboard", () => {
  const { commonStore, userStore, notificationStore } = useStores();

  const allBoards = ref<IWorkingBoardItem[]>([]);

  const boardItem = ref<IWorkingBoardItem>({} as IWorkingBoardItem);

  const boardMembers = ref([] as IUserForList[]);

  const boardCodes = ref<string[]>([]);

  const setAllDashboard = (dashboards: IWorkingBoardItem[]): void => {
    allBoards.value = dashboards;
  };
  const addNewBoard = (item: IWorkingBoardItem): void => {
    allBoards.value.push(item);
  };
  const clearList = (): void => {
    allBoards.value = [];
    boardCodes.value = [];
  };
  const createNewWorkingBoard = (
    board: IWorkingBoardItem,
    unicID: string
  ): Promise<IWorkingBoardItem> => {
    commonStore.setLoadingStatus(true);

    return new Promise((resolve, reject) => {
      createJoinCode(unicID, board.joinCode)
        .then(() => {
          const refference = Refference(RTDatabase, board.joinCode);

          set(refference, board).then(() => {
            onValue(
              refference,
              (boardSnapshot) => {
                allBoards.value.push(boardSnapshot.val());
              },
              { onlyOnce: true }
            );
            resolve(board);
          });
        })
        .catch((error: ErrorCode) => {
          ShowErrorMessage(error);
          commonStore.setLoadingStatus(false);
          reject(error);
        });
    });
  };

  // Codes actions.
  const createJoinCode = (unicID: string, joinCode: string): Promise<string> => {
    const dashboardRef = doc(database, DataCollection.Dashboard, unicID);

    return new Promise((resolve, reject) => {
      getDoc(dashboardRef).then((codesDoc) => {
        if (codesDoc.exists()) {
          boardCodes.value.push(joinCode);

          updateDoc(dashboardRef, "collection", boardCodes.value)
            .then(() => {
              resolve(joinCode);
            })
            .catch((error: ErrorCode) => {
              ShowErrorMessage(error);
              reject(error);
            })
            .finally(() => commonStore.setLoadingStatus(false));
        } else {
          setDoc(doc(database, DataCollection.Dashboard, unicID), {
            collection: [joinCode],
          })
            .then(() => {
              boardCodes.value.push(joinCode);
              resolve(joinCode);
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
  const deleteAllCodes = (unicID: string): Promise<void> => {
    const dashboardRef = doc(database, DataCollection.Dashboard, unicID);

    commonStore.setLoadingStatus(true);
    return new Promise((resolve, reject) => {
      deleteDoc(dashboardRef)
        .then(() => {
          clearList();
          resolve();
        })
        .catch((error: ErrorCode) => {
          ShowErrorMessage(error);
          reject(error);
        })
        .finally(() => commonStore.setLoadingStatus(false));
    });
  };
  const getAllJoinCodes = (unicID: string): Promise<void> => {
    const dashboardRef = doc(database, DataCollection.Dashboard, unicID);

    return new Promise((resolve, reject) => {
      getDoc(dashboardRef)
        .then((response) => {
          boardCodes.value = (response.data()?.collection as string[]) || [];
          resolve();
        })
        .catch((error: ErrorCode) => {
          ShowErrorMessage(error);
          reject(error);
        });
    });
  };
  const updateAllJoinCodes = (unicID: string): Promise<void> => {
    const dashboardRef = doc(database, DataCollection.Dashboard, unicID);

    return new Promise((resolve, reject) => {
      updateDoc(dashboardRef, "collection", boardCodes.value)
        .then(() => {
          resolve();
        })
        .catch((error: ErrorCode) => {
          ShowErrorMessage(error);
          reject(error);
        });
    });
  };
  // Board actions.
  const getAllWorkingBoards = (unicID: string): Promise<IWorkingBoardItem[]> => {
    commonStore.setLoadingStatus(true);
    return new Promise((resolve, reject) => {
      getAllJoinCodes(unicID)
        .then(() => {
          if (boardCodes.value.length) {
            boardCodes.value.map((joinCode) => {
              onValue(Refference(RTDatabase, joinCode), (boardSnapshot) => {
                if (boardSnapshot.val() !== null) {
                  const boardExistIndex = allBoards.value.findIndex(
                    (board) => board.joinCode === joinCode
                  );

                  if (boardExistIndex !== -1) {
                    allBoards.value[boardExistIndex].members =
                      boardSnapshot.val().members;
                  } else {
                    allBoards.value.push(boardSnapshot.val());
                  }

                  commonStore.setLoadingStatus(false);
                }
              });
            });
            resolve(allBoards.value);
          } else {
            resolve([]);

            commonStore.setLoadingStatus(false);
          }
        })
        .catch((error: ErrorCode) => {
          commonStore.setLoadingStatus(false);
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
      getAllJoinCodes(unicID).then(() => {
        if (boardCodes.value.includes(joinCode)) {
          onValue(Refference(RTDatabase, joinCode), async (boardData) => {
            const currentBoard = boardData.val() as IWorkingBoardItem;
            if (currentBoard) {
              if (currentBoard.members?.length) {
                await userStore.getUsersList(true, false).then(async (users) => {
                  const membersID = currentBoard.members.map((item) => item.uid);

                  const sortedUsersAsMembers = users.filter((user) =>
                    membersID.includes(user.uid)
                  );

                  // Set tasks if none exist.
                  currentBoard.columns.map((column) => {
                    if (!column.tasks) column.tasks = [];
                  });

                  sortedUsersAsMembers.forEach((item) => {
                    const member = currentBoard.members.find(
                      (user) => user.uid === item.uid
                    );
                    if (member) {
                      item.role = member.role ?? "";
                      item.invited = member.invited ?? false;
                    }
                  });

                  await membersExist({
                    value: currentBoard,
                    members: sortedUsersAsMembers,
                  });

                  boardMembers.value = sortedUsersAsMembers;
                  boardItem.value = currentBoard;

                  resolve(boardItem.value);
                });
              } else {
                set(Refference(RTDatabase, joinCode), null); // Delete board from database.

                const currentBoardCodeIndex = boardCodes.value.findIndex(
                  (code) => code === joinCode
                );

                boardCodes.value.splice(currentBoardCodeIndex, 1);
                await updateAllJoinCodes(unicID);
              }
            }
          });
        } else {
          reject(new Error("Not found"));

          notify({
            title: "Рабочая доска недоступна!",
            text: "Текущая доска не существует или код приглашения неверный.",
            type: "error",
          });
        }
      });

      commonStore.setLoadingStatus(false);
    });
  };

  const updateWorkingBoard = async (
    updatedBoard: IWorkingBoardItem,
    showLoading = true
  ): Promise<void> => {
    commonStore.setLoadingStatus(showLoading);

    await update(Refference(RTDatabase, updatedBoard.joinCode), updatedBoard)
      .catch((error: ErrorCode) => {
        ShowErrorMessage(error);
      })
      .finally(() => {
        commonStore.setLoadingStatus(false);
      });
  };

  const joinWorkingBoard = (
    { joinCode }: Pick<IWorkingBoardItem, "uid" | "joinCode">,
    unicID: string
  ) => {
    get(child(Refference(RTDatabase), joinCode)).then((boardDoc) => {
      if (boardDoc.exists()) {
        createJoinCode(unicID, joinCode).then(() => {
          const board = boardDoc.val() as IWorkingBoardItem;

          // Set task arrays if none exist.
          board.columns.map((column) => {
            if (!column.tasks) column.tasks = [];
          });

          // Change invited status
          const currentInvitedUser = board.members.find((user) => user.uid === unicID);

          if (currentInvitedUser) {
            delete currentInvitedUser.invited;
            currentInvitedUser.role = UserRole.Member;

            updateWorkingBoard(board);

            allBoards.value.push(board);

            notify({
              title: "Успешно!",
              text: "Вы успешно присоединились к рабочему пространству!",
            });
          }
        });
      } else {
        notify({
          title: "Рабочая доска недоступна!",
          text: "Текущая доска не существует или код приглашения неверный.",
          type: "error",
        });

        router.push({ name: "Dashboard" });
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
        firstInvitedUser.role = UserRole.Admin;

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

        // Delete join code from own collection.
        await getAllJoinCodes(memberID).then(() => {
          const myBoardJoinCodeIndex = boardCodes.value.findIndex(
            (code) => code === fromBoard.joinCode
          );
          if (myBoardJoinCodeIndex !== -1) {
            boardCodes.value.splice(myBoardJoinCodeIndex, 1);
          }
        });

        // Delete local board.
        if (allBoards.value.length) {
          const myBoardIndex = allBoards.value.findIndex(
            (board) => board.joinCode === fromBoard.joinCode
          );
          if (myBoardIndex !== -1) {
            allBoards.value.splice(myBoardIndex, 1);
          }
        }

        router.push({ name: "Dashboard" });

        await updateAllJoinCodes(memberID);

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
          role: item.role as UserRole,
          uid: item.uid,
          invited: item?.invited,
        };
      });

      const adminExist = exist.some((member) => member.role === UserRole.Admin);

      // Set new admin board for first invited user.
      if (!adminExist) {
        const newAdmin = exist[0];
        newAdmin.role = UserRole.Admin;

        // Set for saved members.
        boardInfo.members[0].role = UserRole.Admin;

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

  return {
    allBoards,
    boardItem,
    boardMembers,
    clearList,
    setAllDashboard,
    addNewBoard,
    createNewWorkingBoard,
    getAllWorkingBoards,
    updateWorkingBoard,
    getWorkingBoardItem,
    joinWorkingBoard,
    leaveWorkingBoard,
    deleteAllCodes,
  };
});

export default useDashboardStore;

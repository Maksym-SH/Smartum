import { defineStore } from "pinia";
import { ref } from "vue";
import { notify } from "@kyvg/vue3-notification";
import { RTDatabase, database } from "@/helpers/firebase/firebaseInitialize";
import * as db from "firebase/database";
import * as fs from "firebase/firestore";

import i18n from "@/i18n";
import router from "@/router";
import ShowErrorMessage from "@/helpers/firebase/firebaseErrorMessage";
import useStores from "@/composables/useStores";
import useNewNotificationContent from "@/composables/useNotificationContent";

import * as enums from "@/types/enums";
import type * as boardType from "@/types/interfaces/board";
import type { ErrorCode } from "@/types";
import type { IUserForList } from "@/types/interfaces/user";

const useDashboardStore = defineStore("dashboard", () => {
  const { t } = i18n.global;

  const { commonStore, userStore, notificationStore, statisticsStore } = useStores();

  const allBoards = ref<boardType.IWorkingBoardItem[]>([]);

  const boardItem = ref<boardType.IWorkingBoardItem>({} as boardType.IWorkingBoardItem);

  const boardMembers = ref([] as IUserForList[]);

  const boardCodes = ref<string[]>([]);

  const setAllDashboard = (dashboards: boardType.IWorkingBoardItem[]): void => {
    allBoards.value = dashboards;
  };
  const addNewBoard = (item: boardType.IWorkingBoardItem): void => {
    allBoards.value.push(item);
  };
  const clearList = (): void => {
    allBoards.value = [];
    boardCodes.value = [];
  };

  // Codes actions.
  const createJoinCode = (unicID: string, joinCode: string): Promise<string> => {
    const dashboardRef = fs.doc(database, enums.DataCollection.DASHBOARD, unicID);

    return new Promise((resolve, reject) => {
      fs.getDoc(dashboardRef).then((codesDoc) => {
        if (codesDoc.exists()) {
          boardCodes.value.push(joinCode);

          fs.updateDoc(dashboardRef, "collection", boardCodes.value)
            .then(() => {
              resolve(joinCode);
            })
            .catch((error: ErrorCode) => {
              ShowErrorMessage(error);
              reject(error);
            })
            .finally(() => commonStore.setLoadingStatus(false));
        } else {
          fs.setDoc(fs.doc(database, enums.DataCollection.DASHBOARD, unicID), {
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
    const dashboardRef = fs.doc(database, enums.DataCollection.DASHBOARD, unicID);

    commonStore.setLoadingStatus(true);
    return new Promise((resolve, reject) => {
      fs.deleteDoc(dashboardRef)
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
    const dashboardRef = fs.doc(database, enums.DataCollection.DASHBOARD, unicID);

    return new Promise((resolve, reject) => {
      fs.getDoc(dashboardRef)
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
    const dashboardRef = fs.doc(database, enums.DataCollection.DASHBOARD, unicID);

    return new Promise((resolve, reject) => {
      fs.updateDoc(dashboardRef, "collection", boardCodes.value)
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
  const createNewWorkingBoard = (
    board: boardType.IWorkingBoardItem,
    unicID: string
  ): Promise<boardType.IWorkingBoardItem> => {
    commonStore.setLoadingStatus(true);

    return new Promise((resolve, reject) => {
      createJoinCode(unicID, board.joinCode)
        .then(() => {
          const refference = db.ref(RTDatabase, board.joinCode);

          db.set(refference, board).then(() => {
            db.onValue(
              refference,
              (boardSnapshot) => {
                allBoards.value.push(boardSnapshot.val());

                // Update statistics.
                statisticsStore.incrementStatisticItem(enums.Activity.CREATED_BOARDS);
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
  const updateWorkingBoard = async (
    updatedBoard: boardType.IWorkingBoardItem,
    showLoading = true
  ): Promise<void> => {
    commonStore.setLoadingStatus(showLoading);
    await db
      .update(db.ref(RTDatabase, updatedBoard.joinCode), updatedBoard)
      .catch((error: ErrorCode) => {
        ShowErrorMessage(error);
      })
      .finally(() => {
        commonStore.setLoadingStatus(false);
      });
  };

  const membersExist = async (
    boardInfo: boardType.IWorkingBoardResolve
  ): Promise<boardType.IWorkingBoardResolve> => {
    const loadedMembers = boardInfo.members;

    const savedMembers = boardInfo.value.members;

    if (loadedMembers.length !== savedMembers.length) {
      const exist: boardType.IWorkingBoardMember[] = loadedMembers.map((item) => {
        return {
          role: item.role,
          uid: item.uid,
          invited: item?.invited,
        };
      });

      const adminExist = exist.some((member) => member.role === enums.UserRole.ADMIN);

      // Set new admin board for first invited user.
      if (!adminExist) {
        const newAdmin = exist[0];
        newAdmin.role = enums.UserRole.ADMIN;

        // Set for saved members.
        boardInfo.members[0].role = enums.UserRole.ADMIN;

        const newAdminNotification = useNewNotificationContent(
          enums.NotificationType.SET_ADMIN,
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
  const getAllWorkingBoards = (unicID: string): Promise<boardType.IWorkingBoardItem[]> => {
    commonStore.setLoadingStatus(true);
    return new Promise((resolve, reject) => {
      getAllJoinCodes(unicID)
        .then(() => {
          if (boardCodes.value.length) {
            boardCodes.value.forEach((joinCode) => {
              db.onValue(db.ref(RTDatabase, joinCode), (boardSnapshot) => {
                if (boardSnapshot.val() !== null) {
                  const boardExistIndex = allBoards.value.findIndex(
                    (board) => board.joinCode === joinCode
                  );

                  if (boardExistIndex !== -1)
                    allBoards.value[boardExistIndex].members = boardSnapshot.val().members;
                  else allBoards.value.push(boardSnapshot.val());

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
  ): Promise<boardType.IWorkingBoardItem | object> => {
    commonStore.setLoadingStatus(true);

    return new Promise((resolve, reject) => {
      getAllJoinCodes(unicID).then(() => {
        if (boardCodes.value.includes(joinCode)) {
          db.onValue(db.ref(RTDatabase, joinCode), async (boardData) => {
            const currentBoard = boardData.val() as boardType.IWorkingBoardItem;

            if (router.currentRoute.value.params?.code !== currentBoard?.joinCode) {
              return;
            }

            if (currentBoard) {
              if (currentBoard.members?.length && !currentBoard.members[0].invited) {
                await userStore.getUsersList(true, false).then(async (users) => {
                  const membersID = currentBoard.members.map((item) => item.uid);

                  const sortedUsersAsMembers = users.filter((user) =>
                    membersID.includes(user.uid)
                  );

                  // Set tasks if none exist.
                  currentBoard.columns.forEach((column) => {
                    if (!column.tasks) {
                      column.tasks = [];
                    }
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
                db.set(db.ref(RTDatabase, joinCode), null); // Delete board from database.

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
            title: t("notify.boardNotFound.title"),
            text: t("notify.boardNotFound.text"),
            type: "error",
          });
        }
      });

      commonStore.setLoadingStatus(false);
    });
  };

  const joinWorkingBoard = (
    { joinCode }: Pick<boardType.IWorkingBoardItem, "uid" | "joinCode">,
    unicID: string
  ) => {
    db.get(db.child(db.ref(RTDatabase), joinCode)).then((boardDoc) => {
      if (boardDoc.exists()) {
        createJoinCode(unicID, joinCode).then(() => {
          const board = boardDoc.val() as boardType.IWorkingBoardItem;

          // Set task arrays if none exist.
          board.columns.forEach((column) => {
            if (!column.tasks) {
              column.tasks = [];
            }
          });

          // Change invited status
          const currentInvitedUser = board.members.find((user) => user.uid === unicID);

          if (currentInvitedUser) {
            delete currentInvitedUser.invited;
            currentInvitedUser.role = enums.UserRole.MEMBER;

            updateWorkingBoard(board);

            allBoards.value.push(board);

            notify({
              title: t("common.success"),
              text: t("notify.boardJoin.text"),
            });
          }
        });
      } else {
        notify({
          title: t("notify.boardNotFound.title"),
          text: t("notify.boardNotFound.text"),
          type: "error",
        });

        router.push({ name: enums.Route.DASHBOARD });
      }
    });
  };

  const leaveWorkingBoard = (
    member: boardType.IWorkingBoardMember,
    fromBoard: boardType.IWorkingBoardItem
  ): Promise<void> => {
    const memberID = member.uid;
    const leavedMemberIndex = fromBoard.members.findIndex((user) => user.uid === memberID);

    if (leavedMemberIndex !== -1) {
      fromBoard.members.splice(leavedMemberIndex, 1); // Remove user.

      const firstMember = fromBoard.members[0];

      if (fromBoard.uid === member.uid && firstMember && !firstMember.invited) {
        fromBoard.uid = firstMember.uid; // Set as admin the first invited user.
        firstMember.role = enums.UserRole.ADMIN;

        const notification = useNewNotificationContent(
          enums.NotificationType.SET_ADMIN,
          fromBoard.title,
          fromBoard
        );
        notificationStore.sendNotificationToUser(firstMember, notification);
      }
    }

    return new Promise((resolve, reject) => {
      try {
        updateWorkingBoard(fromBoard).then(async () => {
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

          router.push({ name: enums.Route.DASHBOARD });

          await updateAllJoinCodes(memberID);

          resolve();
        });
      } catch (error: unknown) {
        ShowErrorMessage(error as ErrorCode);
        reject(error);
      } finally {
        commonStore.setLoadingStatus(false);
      }
    });
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

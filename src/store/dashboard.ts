import { defineStore } from "pinia";
import { ref } from "vue";
import { IWorkingBoardItem } from "@/types/interfaces";
import { ErrorCode } from "@/types/types";
import { database } from "@/helpers/firebase/firebaseInitialize"; 
import { DataCollection } from "@/types/enums";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { NewObjectLink } from "@/helpers/methods";

import ShowErrorMessage from "@/helpers/firebase/firebaseErrorMessage";
import useStores from "@/composables/useStores";

const useDashboardStore = defineStore("dashboard", () => {
  const { commonStore } = useStores();

  const allDashboards = ref<IWorkingBoardItem[]>([]);


  const setAllDashboard = (dashboards: IWorkingBoardItem[]): void => {
    allDashboards.value = dashboards;
  };
  const addNewBoard = (item: IWorkingBoardItem): void => {
    allDashboards.value.push(item);
  };
  const createNewWorkingBoard = (board: IWorkingBoardItem, unicID: string): Promise<IWorkingBoardItem> => {
    const dashboardRef = doc(database, DataCollection.Dashboard, unicID);

    commonStore.setLoadingStatus(true);

    return new Promise((resolve, reject) => {
      getDoc(dashboardRef).then((docSnap) => {
        if (docSnap.exists()) {
          const currentCollectionDasboard = NewObjectLink(allDashboards.value);
          currentCollectionDasboard.push(board);

          updateDoc(dashboardRef, "collection", currentCollectionDasboard)
          .then(() => {
            addNewBoard(board);
            resolve(board);
          })
          .catch((error: ErrorCode) => {
            ShowErrorMessage(error);
            reject(error);
          })
          .finally(() => commonStore.setLoadingStatus(false))
        }
        else {
          setDoc(doc(database, DataCollection.Dashboard, unicID), {
            collection: [board]
          })
          .then(() => { 
            addNewBoard(board);
            resolve(board);
          })
          .catch((error: ErrorCode) => {
            ShowErrorMessage(error);
            reject(error);
          })
          .finally(() => commonStore.setLoadingStatus(false))
        }
      })
    })
  };
  const getAllWorkingBoards = (unicID: string): Promise<IWorkingBoardItem[]> => {
    const dashboardRef = doc(database, DataCollection.Dashboard, unicID);

    commonStore.setLoadingStatus(true);
    return new Promise((resolve, reject) => {
      getDoc(dashboardRef).then((dashboards) => {
        const allDashboards = dashboards.data()?.collection;
        if (allDashboards) {
          setAllDashboard(allDashboards);
          resolve(allDashboards as IWorkingBoardItem[]);
        }
      })
      .catch((error: ErrorCode) => {
        ShowErrorMessage(error);
        reject(error)
      })
      .finally(() => commonStore.setLoadingStatus(false))
    })
  };

  return {
    allDashboards,
     setAllDashboard,
     addNewBoard,
     createNewWorkingBoard,
     getAllWorkingBoards
  }
})

export default useDashboardStore;
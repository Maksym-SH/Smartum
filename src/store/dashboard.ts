import { IDashboardState, IWorkingBoardItem, ICreateBoardParams } from "@/interfaces";
import { ErrorCode, ModuleCtx } from "@/types";
import { database } from "@/helpers/firebase/firebaseInitialize"; 
import { DataCollection } from "@/enums";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { NewObjectLink } from "@/helpers/methods";

import ShowErrorMessage from "@/helpers/firebase/firebaseErrorMessage";

export default {
  state: {
    allDashboards: []
  },
  mutations: {
    setAllDashboard(state: IDashboardState, dashboards: IWorkingBoardItem[]): void {
      state.allDashboards = dashboards;
    },
    addNewBoard(state: IDashboardState, item: IWorkingBoardItem): void {
      state.allDashboards.push(item);
    }
  },
  actions: {
    createNewWorkingBoard({ state, commit }: ModuleCtx<IDashboardState>, data: ICreateBoardParams): Promise<IWorkingBoardItem<Date>> {
      const dashboardRef = doc(database, DataCollection.Dashboard, data.unicID);

      commit("setLoadingStatus", true);

      return new Promise((resolve, reject) => {
        getDoc(dashboardRef).then((docSnap) => {
          if (docSnap.exists()) {
            const currentCollectionDasboard = NewObjectLink(state.allDashboards);
            currentCollectionDasboard.push(data.board);

            updateDoc(dashboardRef, "collection", currentCollectionDasboard)
            .then(() => {
              commit("addNewBoard", data.board);
              resolve(data.board);
            })
            .catch((error: ErrorCode) => {
              ShowErrorMessage(error);
              reject(error);
            })
            .finally(() => commit("setLoadingStatus", false))
          }
          else {
            setDoc(doc(database, DataCollection.Dashboard, data.unicID), {
              collection: [data.board]
            })
            .then(() => {
              commit("addNewBoard", data.board);
              resolve(data.board);
            })
            .catch((error: ErrorCode) => {
              ShowErrorMessage(error);
              reject(error);
            })
            .finally(() => commit("setLoadingStatus", false))
          }
        })
      })
    },
    getAllWorkingBoards({ commit }: ModuleCtx<IDashboardState>, unicID: string): Promise<IWorkingBoardItem[]> {
      const dashboardRef = doc(database, DataCollection.Dashboard, unicID);

      commit("setLoadingStatus", true);
      return new Promise((resolve, reject) => {
        getDoc(dashboardRef).then((dashboards) => {
          const allDashboards = dashboards.data()?.collection;
          if (allDashboards) {
            commit("setAllDashboard", allDashboards);
            resolve(allDashboards as IWorkingBoardItem[]);
          }
        })
        .catch((error: ErrorCode) => {
          ShowErrorMessage(error);
          reject(error)
        })
        .finally(() => commit("setLoadingStatus", false))
      })
    }
  },
}
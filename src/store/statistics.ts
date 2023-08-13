import { ref } from "vue";
import { defineStore } from "pinia";
import { deleteDoc, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { database } from "@/helpers/firebase/firebaseInitialize";

import useStores from "@/composables/useStores";
import useCurrentUserInfo from "@/composables/useCurrentUserInfo";
import ShowErrorMessage from "@/helpers/firebase/firebaseErrorMessage";

import type { IServerDate } from "@/types/interfaces";
import type { IStatistics } from "@/types/interfaces/statistics";
import type { Activity } from "@/types/enums";
import { DataCollection, Numbers } from "@/types/enums";
import type { ErrorCode } from "@/types";

const usestatisticsStore = defineStore("statistics", () => {
  const { commonStore } = useStores();

  const statistics = ref<IStatistics>({
    visits: [],
    boardActivity: [0, 0, 0, 0, 0, 0],
  });

  const statisticLoaded = ref(false);

  const addNewDays = () => {
    statistics.value.visits.push({
      visitCount: 1,
      date: new Date(),
    });

    if (statistics.value.visits.length < 7) {
      const missingDays = 7 - statistics.value.visits.length;

      for (let days = 0; days < missingDays; days++) {
        const previousDate = new Date();
        previousDate.setDate(previousDate.getDate() - days - 1);

        statistics.value.visits.unshift({
          visitCount: 0,
          date: previousDate,
        });
      }
    }
  };

  const getStatistic = (): void => {
    const { unicID } = useCurrentUserInfo();

    const statisticRef = doc(database, DataCollection.STATISTICS, unicID.value);

    commonStore.setLoadingStatus(true);
    getDoc(statisticRef)
      .then((statisticDoc) => {
        if (statisticDoc.exists()) {
          statistics.value = statisticDoc.data() as IStatistics;

          if (!sessionStorage.getItem("smartumAppVisited")) {
            // Write new day.
            const currentDay = new Date().getDate() - 1;

            const lastVisitDateSeconds = (
              statistics.value.visits.at(-1)?.date as IServerDate
            ).seconds;

            const oldDay = new Date(lastVisitDateSeconds * Numbers.SECOND).getDate() - 1;

            if (currentDay === oldDay) {
              // New visit today.
              const lastDate = statistics.value.visits.at(-1);

              if (lastDate) {
                lastDate.visitCount++; // New visit.
              }

              updateStatistic();
            } else {
              addNewDays();

              // Limit 7 days.
              if (statistics.value.visits.length > 7) {
                statistics.value.visits.shift(); // Delete oldest date.

                updateDoc(statisticRef, {
                  visits: statistics.value.visits,
                });
              }
            }

            sessionStorage.setItem("smartumAppVisited", "visited");
          }
        } else {
          addNewDays();
          setDoc(statisticRef, statistics.value);
        }

        statisticLoaded.value = true;
      })
      .finally(() => commonStore.setLoadingStatus(false));
  };

  const clearList = (): void => {
    statistics.value = {
      visits: [],
      boardActivity: [0, 0, 0, 0, 0, 0],
    };

    statisticLoaded.value = false;
  };

  const updateStatistic = async (): Promise<void> => {
    const { unicID } = useCurrentUserInfo();
    const statisticRef = doc(database, DataCollection.STATISTICS, unicID.value);

    return await updateDoc(statisticRef, statistics.value);
  };

  const incrementStatisticItem = async (index: Activity): Promise<void> => {
    statistics.value.boardActivity[index] += 1;

    return await updateStatistic();
  };

  const deleteStatistic = (unicID: string): Promise<void> => {
    const statisticRef = doc(database, DataCollection.STATISTICS, unicID);

    commonStore.setLoadingStatus(true);
    return new Promise((resolve, reject) => {
      deleteDoc(statisticRef)
        .then(() => {
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
    statistics,
    statisticLoaded,
    getStatistic,
    updateStatistic,
    incrementStatisticItem,
    deleteStatistic,
    clearList,
  };
});

export default usestatisticsStore;

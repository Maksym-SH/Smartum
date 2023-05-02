import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { firebaseConfig } from "@/helpers/firebase/firebaseConfig";
import { getFirestore } from "firebase/firestore";

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
getAnalytics(firebaseApp);

// Export firebase firestore.
export const database = getFirestore(firebaseApp);
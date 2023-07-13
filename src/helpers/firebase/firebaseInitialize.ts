import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { firebaseConfig } from "@/helpers/firebase/firebaseConfig";

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
getAnalytics(firebaseApp);

// Export firebase firestore.
export const database = getFirestore(firebaseApp);
export const RTDatabase = getDatabase(firebaseApp);

import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, update,set  } from "firebase/database";
import { firebaseConfig } from "../../firebaseConfig";

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db, ref, get, update, set };

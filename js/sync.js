import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc, deleteDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import LZString from "https://cdn.jsdelivr.net/npm/lz-string@1.5.0/+esm";

const firebaseConfig = {
  apiKey: "AIzaSyB1_FtRg3ZI2LowBkKuWyhHnbJygfbGn2I",
  authDomain: "warframe-completion-tracker.firebaseapp.com",
  projectId: "warframe-completion-tracker",
  storageBucket: "warframe-completion-tracker.firebasestorage.app",
  messagingSenderId: "428193211361",
  appId: "1:428193211361:web:0cec1e9a609816955e28a0"
};

const COLLECTION_NAME = "sync_sessions";
const ERROR_RATE_LIMITED = "CLIENT_RATE_LIMITED"
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let _lastPushAt = 0;
let _lastPullAt = 0;
const PUSH_COOLDOWN_MS = 10000; // doit rester synchronisé avec les 10s de isNotRateLimited() dans les rules Firebase
const PULL_COOLDOWN_MS = 10000;

window.WF = window.WF || {};

WF.sync = {
  getCompressedPayload() {
    const rawData = WF.storage ? WF.storage.load() : {};
    const options = WF.options ? WF.options.load() : {};
    const payloadObj = { data: rawData, options: options };
    return LZString.compressToBase64(JSON.stringify(payloadObj));
  },

	async pushData(syncKey) {
		if (!syncKey || syncKey.length !== 64) return false;
		if (Date.now() - _lastPushAt < PUSH_COOLDOWN_MS) throw new Error(ERROR_RATE_LIMITED);
		try {
			const compressedPayload = this.getCompressedPayload();
			await setDoc(doc(db, COLLECTION_NAME, syncKey), {
				payload: compressedPayload,
				updatedAt: serverTimestamp()
			}, { merge: true });
			_lastPushAt = Date.now();
			return true;
		} catch (err) {
			if (err.code === "permission-denied") {
				throw new Error(ERROR_RATE_LIMITED);
			}
			console.error("[Sync] Error pushing data:", err.code, err.message);
			throw err;
		}
	},
	
  async pullData(syncKey) {
    if (!syncKey || syncKey.length !== 64) return null;
    if (Date.now() - _lastPullAt < PULL_COOLDOWN_MS) throw new Error(ERROR_RATE_LIMITED);
    try {
      const docRef = doc(db, COLLECTION_NAME, syncKey);
      const docSnap = await getDoc(docRef);
      _lastPullAt = Date.now();
      if (docSnap.exists()) {
        const compressedPayload = docSnap.data().payload;
        if (compressedPayload) {
          const decompressedString = LZString.decompressFromBase64(compressedPayload);
          if (decompressedString) {
            return JSON.parse(decompressedString);
          }
        }
      }
      return null;
    } catch (err) {
      console.error("[Sync] Error pulling data:", err.code, err.message);
      throw err;
    }
  },
  async deleteRemoteData(syncKey) {
    if (!syncKey || syncKey.length !== 64) return false;
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, syncKey));
      return true;
    } catch (err) {
      console.error("[Sync] Error deleting remote data:", err.code, err.message);
      throw err;
    }
  },
};

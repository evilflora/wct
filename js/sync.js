/* This file use "Auto-Minify" in "Visual Studio Code" to create it's compressed version on save */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc, deleteDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import LZString from "../vendor/lz-string.js";

const firebaseConfig = {
  apiKey: "AIzaSyB1_FtRg3ZI2LowBkKuWyhHnbJygfbGn2I",
  authDomain: "warframe-completion-tracker.firebaseapp.com",
  projectId: "warframe-completion-tracker",
  storageBucket: "warframe-completion-tracker.firebasestorage.app",
  messagingSenderId: "428193211361",
  appId: "1:428193211361:web:0cec1e9a609816955e28a0"
};

const COLLECTION_NAME = "sync_sessions";
const ERROR_RATE_LIMITED = "CLIENT_RATE_LIMITED";
const ERROR_REMOTE_AHEAD = "REMOTE_AHEAD";
const SYNC_KEY_PATTERN = /^[a-f0-9]{64}$/;
const MAX_PAYLOAD_BYTES = 256000;

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let _lastPushAt = 0;
let _lastPullAt = 0;
let _lastKnownRemoteAt = 0;
const PUSH_COOLDOWN_MS = 10000;
const PULL_COOLDOWN_MS = 10000;

window.WF = window.WF || {};

function isValidKey(syncKey) {
  return typeof syncKey === "string" && SYNC_KEY_PATTERN.test(syncKey);
}

function remoteMillis(snapshot) {
  if (!snapshot.exists()) return 0;
  const updatedAt = snapshot.data().updatedAt;
  return updatedAt && typeof updatedAt.toMillis === "function" ? updatedAt.toMillis() : 0;
}

WF.sync = {
  ERROR_RATE_LIMITED,
  ERROR_REMOTE_AHEAD,

  getCompressedPayload() {
    const rawData = WF.storage ? WF.storage.loadForSync() : {};
    const options = WF.options ? { ...WF.options.load() } : {};
    delete options.syncKey;
    return LZString.compressToBase64(JSON.stringify({ data: rawData, options }));
  },

  async pushData(syncKey, { force = false } = {}) {
    if (!isValidKey(syncKey)) return false;

    const previousPushAt = _lastPushAt;
    if (Date.now() - previousPushAt < PUSH_COOLDOWN_MS) throw new Error(ERROR_RATE_LIMITED);
    _lastPushAt = Date.now();

    try {
      const compressedPayload = this.getCompressedPayload();
      if (compressedPayload.length > MAX_PAYLOAD_BYTES) throw new Error("PAYLOAD_TOO_LARGE");

      const docRef = doc(db, COLLECTION_NAME, syncKey);

      if (!force) {
        const snapshot = await getDoc(docRef);
        const remoteAt = remoteMillis(snapshot);
        if (remoteAt > 0 && remoteAt > _lastKnownRemoteAt) throw new Error(ERROR_REMOTE_AHEAD);
      }

      await setDoc(docRef, {
        payload: compressedPayload,
        schemaVersion: WF.SCHEMA_VERSION,
        updatedAt: serverTimestamp()
      }, { merge: true });

      _lastKnownRemoteAt = Date.now();
      return true;
    } catch (err) {
      _lastPushAt = previousPushAt;
      if (err.code === "permission-denied") throw new Error(ERROR_RATE_LIMITED);
      if (err.message !== ERROR_REMOTE_AHEAD) console.error("[Sync] Error pushing data:", err.code, err.message);
      throw err;
    }
  },

  async pullData(syncKey) {
    if (!isValidKey(syncKey)) return null;

    const previousPullAt = _lastPullAt;
    if (Date.now() - previousPullAt < PULL_COOLDOWN_MS) throw new Error(ERROR_RATE_LIMITED);
    _lastPullAt = Date.now();

    try {
      const snapshot = await getDoc(doc(db, COLLECTION_NAME, syncKey));
      if (!snapshot.exists()) return null;

      _lastKnownRemoteAt = remoteMillis(snapshot);

      const compressedPayload = snapshot.data().payload;
      if (!compressedPayload) return null;

      const decompressedString = LZString.decompressFromBase64(compressedPayload);
      if (!decompressedString) return null;

      return JSON.parse(decompressedString);
    } catch (err) {
      _lastPullAt = previousPullAt;
      console.error("[Sync] Error pulling data:", err.code, err.message);
      throw err;
    }
  },

  async deleteRemoteData(syncKey) {
    if (!isValidKey(syncKey)) return false;
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, syncKey));
      _lastKnownRemoteAt = 0;
      return true;
    } catch (err) {
      if (err.code === "permission-denied") throw new Error(ERROR_RATE_LIMITED);
      console.error("[Sync] Error deleting remote data:", err.code, err.message);
      throw err;
    }
  },
};

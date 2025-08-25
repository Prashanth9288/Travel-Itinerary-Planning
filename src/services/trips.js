// src/services/trips.js
import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";

// --- helpers ---
const createdAtMillis = (t) => {
  if (!t) return 0;
  // Firestore Timestamp has toMillis(); plain string/date won't.
  return typeof t.toMillis === "function"
    ? t.toMillis()
    : new Date(t).getTime() || 0;
};

const sortByCreatedDesc = (arr) =>
  arr.sort((a, b) => createdAtMillis(b.createdAt) - createdAtMillis(a.createdAt));

// --- create ---
export const createTrip = async (trip) => {
  const ref = collection(db, "trips");
  const docRef = await addDoc(ref, { ...trip, createdAt: serverTimestamp() });
  return docRef.id; // ✅ return only the id
};

// --- read (one-time) ---
export const getTripsByUser = async (userId) => {
  const ref = collection(db, "trips");
  // no orderBy -> avoids composite index requirement
  const q = query(ref, where("userId", "==", userId));
  const snapshot = await getDocs(q);
  const trips = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  return sortByCreatedDesc(trips);
};

export const getTripById = async (id) => {
  const ref = doc(db, "trips", id);
  const snap = await getDoc(ref);
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

// --- update / delete ---
export const updateTrip = async (id, data) => {
  const ref = doc(db, "trips", id);
  return await updateDoc(ref, data);
};

export const deleteTrip = async (id) => {
  const ref = doc(db, "trips", id);
  return await deleteDoc(ref);
};

// --- realtime listeners ---
export const listenToTripsByUser = (userId, callback, onError) => {
  const ref = collection(db, "trips");
  const q = query(ref, where("userId", "==", userId));
  return onSnapshot(
    q,
    (snapshot) => {
      const trips = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      callback(sortByCreatedDesc(trips));
    },
    (err) => {
      console.error("listenToTripsByUser error:", err);
      onError && onError(err);
      callback([]); // fallback empty
    }
  );
};

export const listenToTrip = (id, callback, onError) => {
  const ref = doc(db, "trips", id);
  return onSnapshot(
    ref,
    (snap) =>
      callback(snap.exists() ? { id: snap.id, ...snap.data() } : null),
    (err) => {
      console.error("listenToTrip error:", err);
      onError && onError(err);
      callback(null);
    }
  );
};


// Convenience aliases used by Profile page
export const listTripsByUser = getTripsByUser

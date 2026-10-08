// Firebase configuration & Firestore real-time service for UYGO
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy 
} from 'firebase/firestore';

// Default / Environment Firebase Config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || ""
};

// Check if Firebase is properly configured with project keys
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && 
  firebaseConfig.projectId && 
  !firebaseConfig.projectId.includes("YOUR_")
);

let app = null;
let db = null;

if (isFirebaseConfigured) {
  try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    console.log("Firebase initialized successfully ✨");
  } catch (error) {
    console.warn("Firebase initialization failed, running in fallback mode:", error);
  }
}

// -------------------------------------------------------------------
// 1. Properties (E'lonlar) Realtime Sync
// -------------------------------------------------------------------

export function subscribeToProperties(callback) {
  if (!db) return () => {};
  try {
    const q = query(collection(db, 'properties'));
    return onSnapshot(q, (snapshot) => {
      const items = [];
      snapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() });
      });
      callback(items);
    }, (err) => {
      console.warn("Firestore properties snapshot error:", err);
    });
  } catch (e) {
    return () => {};
  }
}

export async function savePropertyToFirebase(property) {
  if (!db) return false;
  try {
    const docRef = doc(db, 'properties', String(property.id));
    await setDoc(docRef, property, { merge: true });
    return true;
  } catch (e) {
    console.error("Error saving property to Firebase:", e);
    return false;
  }
}

export async function deletePropertyFromFirebase(propertyId) {
  if (!db) return false;
  try {
    await deleteDoc(doc(db, 'properties', String(propertyId)));
    return true;
  } catch (e) {
    console.error("Error deleting property from Firebase:", e);
    return false;
  }
}

// -------------------------------------------------------------------
// 2. Payment Requests (To'lov cheklari) Realtime Sync
// -------------------------------------------------------------------

export function subscribeToPaymentRequests(callback) {
  if (!db) return () => {};
  try {
    const q = query(collection(db, 'payment_requests'));
    return onSnapshot(q, (snapshot) => {
      const items = [];
      snapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() });
      });
      callback(items);
    }, (err) => {
      console.warn("Firestore payment_requests snapshot error:", err);
    });
  } catch (e) {
    return () => {};
  }
}

export async function savePaymentRequestToFirebase(paymentRequest) {
  if (!db) return false;
  try {
    const docRef = doc(db, 'payment_requests', String(paymentRequest.id));
    await setDoc(docRef, paymentRequest, { merge: true });
    return true;
  } catch (e) {
    console.error("Error saving payment request to Firebase:", e);
    return false;
  }
}

// -------------------------------------------------------------------
// 3. Billing Settings (Karta raqami, narxlar) Realtime Sync
// -------------------------------------------------------------------

export function subscribeToBillingSettings(callback) {
  if (!db) return () => {};
  try {
    const docRef = doc(db, 'settings', 'billing');
    return onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        callback(docSnap.data());
      }
    }, (err) => {
      console.warn("Firestore billing settings error:", err);
    });
  } catch (e) {
    return () => {};
  }
}

export async function saveBillingSettingsToFirebase(settings) {
  if (!db) return false;
  try {
    const docRef = doc(db, 'settings', 'billing');
    await setDoc(docRef, settings, { merge: true });
    return true;
  } catch (e) {
    console.error("Error saving billing settings to Firebase:", e);
    return false;
  }
}

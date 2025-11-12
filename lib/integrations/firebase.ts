// ============================================
// FIREBASE INTEGRATION HELPERS
// ============================================

import { initializeApp, getApps, FirebaseApp } from 'firebase/app'
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, User } from 'firebase/auth'
import { getFirestore, collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, query, where, orderBy, limit, Query, DocumentData } from 'firebase/firestore'
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'

// Firebase configuration type
export type FirebaseConfig = {
  apiKey: string
  authDomain: string
  projectId: string
  storageBucket: string
  messagingSenderId: string
  appId: string
  measurementId?: string
}

// Initialize Firebase
let app: FirebaseApp | undefined

export function initializeFirebase(config: FirebaseConfig): FirebaseApp {
  if (getApps().length === 0) {
    app = initializeApp(config)
  } else {
    app = getApps()[0]
  }
  return app
}

// Get Firebase instance (auto-initialize from env if needed)
export function getFirebaseApp(): FirebaseApp {
  if (!app) {
    const config: FirebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
      measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
    }
    app = initializeFirebase(config)
  }
  return app
}

// ============================================
// AUTH HELPERS
// ============================================

export async function firebaseSignIn(email: string, password: string): Promise<User> {
  const auth = getAuth(getFirebaseApp())
  const userCredential = await signInWithEmailAndPassword(auth, email, password)
  return userCredential.user
}

export async function firebaseSignUp(email: string, password: string): Promise<User> {
  const auth = getAuth(getFirebaseApp())
  const userCredential = await createUserWithEmailAndPassword(auth, email, password)
  return userCredential.user
}

export async function firebaseSignOut(): Promise<void> {
  const auth = getAuth(getFirebaseApp())
  await signOut(auth)
}

export function firebaseGetCurrentUser(): User | null {
  const auth = getAuth(getFirebaseApp())
  return auth.currentUser
}

export function firebaseOnAuthStateChange(callback: (user: User | null) => void): () => void {
  const auth = getAuth(getFirebaseApp())
  return auth.onAuthStateChanged(callback)
}

// ============================================
// FIRESTORE HELPERS
// ============================================

export async function firestoreGetDocument<T = DocumentData>(
  collectionName: string,
  documentId: string
): Promise<T | null> {
  const db = getFirestore(getFirebaseApp())
  const docRef = doc(db, collectionName, documentId)
  const docSnap = await getDoc(docRef)

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as T
  }
  return null
}

export async function firestoreGetCollection<T = DocumentData>(
  collectionName: string,
  filters?: {
    where?: { field: string; operator: any; value: any }[]
    orderBy?: { field: string; direction: 'asc' | 'desc' }
    limit?: number
  }
): Promise<T[]> {
  const db = getFirestore(getFirebaseApp())
  let q: Query<DocumentData> = collection(db, collectionName) as Query<DocumentData>

  if (filters?.where) {
    filters.where.forEach((filter) => {
      q = query(q, where(filter.field, filter.operator, filter.value))
    })
  }

  if (filters?.orderBy) {
    q = query(q, orderBy(filters.orderBy.field, filters.orderBy.direction))
  }

  if (filters?.limit) {
    q = query(q, limit(filters.limit))
  }

  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as T[]
}

export async function firestoreSetDocument(
  collectionName: string,
  documentId: string,
  data: any
): Promise<void> {
  const db = getFirestore(getFirebaseApp())
  const docRef = doc(db, collectionName, documentId)
  await setDoc(docRef, data)
}

export async function firestoreUpdateDocument(
  collectionName: string,
  documentId: string,
  data: Partial<any>
): Promise<void> {
  const db = getFirestore(getFirebaseApp())
  const docRef = doc(db, collectionName, documentId)
  await updateDoc(docRef, data)
}

export async function firestoreDeleteDocument(
  collectionName: string,
  documentId: string
): Promise<void> {
  const db = getFirestore(getFirebaseApp())
  const docRef = doc(db, collectionName, documentId)
  await deleteDoc(docRef)
}

// ============================================
// STORAGE HELPERS
// ============================================

export async function firebaseUploadFile(
  path: string,
  file: File | Blob
): Promise<string> {
  const storage = getStorage(getFirebaseApp())
  const storageRef = ref(storage, path)
  await uploadBytes(storageRef, file)
  return getDownloadURL(storageRef)
}

export async function firebaseGetFileUrl(path: string): Promise<string> {
  const storage = getStorage(getFirebaseApp())
  const storageRef = ref(storage, path)
  return getDownloadURL(storageRef)
}

export async function firebaseDeleteFile(path: string): Promise<void> {
  const storage = getStorage(getFirebaseApp())
  const storageRef = ref(storage, path)
  await deleteObject(storageRef)
}

// ============================================
// EXAMPLE USAGE
// ============================================

/*
// Example 1: Authentication
const user = await firebaseSignIn('user@example.com', 'password123')
console.log('Signed in:', user.email)

// Example 2: Get documents from collection
const posts = await firestoreGetCollection('posts', {
  where: [{ field: 'published', operator: '==', value: true }],
  orderBy: { field: 'createdAt', direction: 'desc' },
  limit: 10
})

// Example 3: Upload file and get URL
const file = event.target.files[0]
const url = await firebaseUploadFile('uploads/image.jpg', file)
console.log('File uploaded:', url)
*/

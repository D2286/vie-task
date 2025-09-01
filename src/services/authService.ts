// src/services/authService.ts
import { db } from '../firebase/config';
import { doc, setDoc } from 'firebase/firestore';

export const createUserProfile = async (uid: string, data: { email: string; createdAt: Date }) => {
  const userRef = doc(db, 'users', uid);
  await setDoc(userRef, data);
};

export default createUserProfile;

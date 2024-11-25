
import admin from 'firebase-admin'

export async function verifyIdToken(idToken: string) {
  try {
    return await admin.auth().verifyIdToken(idToken);
  } catch (error) {
    console.error('Error verifying ID token:', error);
    return null;
  }
}



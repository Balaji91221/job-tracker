import { NextApiRequest, NextApiResponse } from 'next'
import { verifyIdToken } from '@/lib/firebase-admin'
import { database } from '@/lib/firebase'
import { ref, update, remove, DatabaseReference } from 'firebase/database'
import { get as firebaseGet } from 'firebase/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const idToken = req.headers.authorization?.split(' ')[1];

  if (!idToken) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const userId = await verifyIdToken(idToken);

    if (req.method === 'PUT') {
      // Ensure data is provided correctly
      if (!req.body || !req.body.someRequiredField) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const updatedApplication = {
        ...req.body,
        approached: req.body.approached === 'true',
        heardBack: req.body.heardBack === 'true',
      };

      // Firebase reference to the specific application
      const applicationRef = ref(database, `applications/${userId}/${id}`);
      await update(applicationRef, updatedApplication);

      // Optionally, confirm the update by fetching the data again
      const updatedDataSnapshot = await get(applicationRef);
      const updatedData = updatedDataSnapshot.val();

      res.status(200).json({ id, ...updatedData });
    } else if (req.method === 'DELETE') {
      const applicationRef = ref(database, `applications/${userId}/${id}`);
      await remove(applicationRef);

      res.status(204).end();
    } else {
      res.setHeader('Allow', ['PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ error: errorMessage });
  }
}


async function get(applicationRef: DatabaseReference) {
  const snapshot = await firebaseGet(applicationRef);
  if (!snapshot.exists()) {
    throw new Error('Application not found');
  }
  return snapshot;
}

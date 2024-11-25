import { NextApiRequest, NextApiResponse } from 'next'
import { verifyIdToken } from '@/lib/firebase-admin'
import { database } from '@/lib/firebase'
import { ref, push, set } from 'firebase/database'
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const idToken = req.headers.authorization?.split(' ')[1];
      if (!idToken) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const userId = await verifyIdToken(idToken);

      if (!req.body || !req.body.someRequiredField) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const application = {
        userId,
        ...req.body,
        approached: req.body.approached === 'true',
        heardBack: req.body.heardBack === 'true',
      };

      // Firebase reference for new application
      const newApplicationRef = push(ref(database, `applications/${userId}`));
      await set(newApplicationRef, application);

      res.status(200).json({ id: newApplicationRef.key, ...application });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'An unknown error occurred' });
      }
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

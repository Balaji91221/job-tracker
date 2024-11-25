import { NextRequest, NextResponse } from 'next/server';
import { verifyIdToken } from '@/lib/auth'; // Helper to verify Firebase ID token
import { db } from '@/lib/firebase-admin'; // Firebase Admin SDK instance

interface User {
    uid: string;
}

interface ApplicationData {
    [key: string]: string | number | boolean | null | undefined;
}

interface Application extends ApplicationData {
    id: string | null;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
    try {
        // Get the Authorization header
        const idToken = request.headers.get('Authorization')?.split('Bearer ')[1];
        if (!idToken) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        // Verify the Firebase ID token
        const user: User | null = await verifyIdToken(idToken);
        if (!user) {
            return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
        }

        const userId = user.uid;
        
        // Parse the incoming JSON body
        const data: ApplicationData = await request.json();

        // Reference to Firebase Realtime Database
        const newApplicationRef = db.ref(`job-applications/${userId}`).push();
        const application: Application = {
            id: newApplicationRef.key,
            ...data,
        };

        // Set the data in Firebase
        await newApplicationRef.set(application);

        return NextResponse.json(application, { status: 201 });
    } catch (error) {
        console.error('Error creating application:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

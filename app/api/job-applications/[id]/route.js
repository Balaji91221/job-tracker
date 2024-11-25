// app/api/job-applications/[id]/route.js

import { NextResponse } from 'next/server';
import { verifyIdToken } from '@/lib/auth'; // Helper to verify Firebase ID token
import { db } from '@/lib/firebase-admin'; // Firebase Admin SDK instance

// Handle GET, PUT, DELETE requests for a specific application
export async function GET(request, { params }) {
  try {
    // Get the Authorization header and extract the ID token
    const idToken = request.headers.get('Authorization')?.split('Bearer ')[1];
    if (!idToken) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Verify the ID token and get the user
    const user = await verifyIdToken(idToken);
    if (!user) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    const userId = user.uid;  // Extract the user's UID
    const { id } = params;  // Get the application ID from the URL parameters

    // Reference to the specific application in the Firebase Realtime Database
    const applicationRef = db.ref(`job-applications/${userId}/${id}`);
    const snapshot = await applicationRef.get();  // Fetch the application data

    if (!snapshot.exists()) {
      return NextResponse.json({ message: 'Application not found' }, { status: 404 });
    }

    // Return the application data as a response
    return NextResponse.json(snapshot.val());
  } catch (error) {
    console.error('Error fetching application:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT request to update a specific application
export async function PUT(request, { params }) {
  try {
    // Get the Authorization header and extract the ID token
    const idToken = request.headers.get('Authorization')?.split('Bearer ')[1];
    if (!idToken) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Verify the ID token and get the user
    const user = await verifyIdToken(idToken);
    if (!user) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    const userId = user.uid;  // Extract the user's UID
    const { id } = params;  // Get the application ID from the URL parameters

    // Parse the request body to get the updated application data
    const body = await request.json();
    const updatedData = body;  // The updated fields for the application

    // Reference to the specific application in the Firebase Realtime Database
    const applicationRef = db.ref(`job-applications/${userId}/${id}`);
    const snapshot = await applicationRef.get();  // Fetch the current application data

    if (!snapshot.exists()) {
      return NextResponse.json({ message: 'Application not found' }, { status: 404 });
    }

    // Update the application data in Firebase
    await applicationRef.update(updatedData);

    return NextResponse.json({ message: 'Application updated successfully' });
  } catch (error) {
    console.error('Error updating application:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE request to delete a specific application
export async function DELETE(request, { params }) {
  try {
    // Get the Authorization header and extract the ID token
    const idToken = request.headers.get('Authorization')?.split('Bearer ')[1];
    if (!idToken) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Verify the ID token and get the user
    const user = await verifyIdToken(idToken);
    if (!user) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    const userId = user.uid;  // Extract the user's UID
    const { id } = params;  // Get the application ID from the URL parameters

    // Reference to the specific application in the Firebase Realtime Database
    const applicationRef = db.ref(`job-applications/${userId}/${id}`);
    const snapshot = await applicationRef.get();  // Fetch the current application data

    if (!snapshot.exists()) {
      return NextResponse.json({ message: 'Application not found' }, { status: 404 });
    }

    // Delete the application data from Firebase
    await applicationRef.remove();

    return NextResponse.json({ message: 'Application deleted successfully' });
  } catch (error) {
    console.error('Error deleting application:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

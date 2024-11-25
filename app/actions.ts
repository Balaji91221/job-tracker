import { auth } from '@/lib/firebase'; // Your Firebase Auth instance
import { getDatabase, ref, get, child, update } from 'firebase/database'; // Firebase Realtime Database imports
import { Application } from '@/types/application'; // Type for application data

const database = getDatabase(); // Initialize Firebase Database

/**
 * Helper function to get the ID token of the currently authenticated user.
 * Throws an error if the user is not authenticated.
 */
async function getIdToken(): Promise<string> {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('User not authenticated');
  }
  return user.getIdToken(); // Firebase method to retrieve the user's ID token
}

/**
 * Helper function to make authorized API requests.
 * Handles fetching and includes proper headers for authentication.
 *
 * @param url - The API endpoint URL
 * @param method - The HTTP method (GET, POST, PUT, DELETE)
 * @param body - The request body as a plain object (optional)
 * @returns A Promise resolving to the parsed JSON response
 */
async function makeApiRequest<T>(
  url: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  body?: Record<string, unknown>
): Promise<T> {
  const idToken = await getIdToken(); // Retrieve the user's ID token

  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`, // Add the ID token to the Authorization header
    },
    body: body && method !== 'GET' ? JSON.stringify(body) : undefined, // Include body for non-GET requests
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    console.error(`API Request failed: ${response.status} - ${response.statusText}`);
    throw new Error(error?.message || `Failed to ${method} resource`);
  }

  return response.json(); // Return the parsed JSON response
}

/**
 * Fetch a single application by its ID from Firebase Realtime Database.
 *
 * @param id - The ID of the application to fetch
 * @returns A Promise resolving to the Application object, or null if not found
 */
export async function getApplicationById(id: string): Promise<Application | null> {
  try {
    const userId = auth.currentUser?.uid;  // Get the authenticated user's ID
    if (!userId) {
      throw new Error('User is not authenticated');
    }

    // Query for the application under the specific userId
    const snapshot = await get(child(ref(database), `job-applications/${userId}/${id}`));
    if (snapshot.exists()) {
      const applicationData = snapshot.val();
      console.log('Found application:', applicationData);
      return { ...applicationData, id }; // Add the ID to the returned object
    } else {
      console.warn(`No application found with ID: ${id}`);
      return null;
    }
  } catch (error) {
    console.error('Error fetching application by ID:', error);
    throw new Error('Failed to fetch application');
  }
}

/**
 * Create a new application using an API.
 *
 * @param formData - A FormData object containing the application data
 * @returns A Promise resolving to the created Application object
 */
export async function createApplication(formData: FormData): Promise<Application> {
  const applicationData = Object.fromEntries(formData.entries()); // Convert FormData to plain object
  return makeApiRequest<Application>('/api/job-applications', 'POST', applicationData);
}

/**
 * Update an existing application by ID using an API.
 *
 * @param id - The ID of the application to update
 * @param formData - A FormData object containing the updated application data
 * @returns A Promise resolving to the updated Application object
 */
export async function updateApplication(id: string, formData: FormData): Promise<Application> {
  const updatedData = Object.fromEntries(formData.entries()); // Convert FormData to plain object
  
  // Ensure the approached and heardBack fields are correctly converted to booleans (or appropriate data type)
  updatedData.approached = updatedData.approached === 'true' ? 'true' : 'false';
  updatedData.heardBack = updatedData.heardBack === 'true' ? 'true' : 'false';
  
  try {
    const userId = auth.currentUser?.uid;  // Get the authenticated user's ID
    if (!userId) {
      throw new Error('User is not authenticated');
    }

    // The path where the application will be updated
    const applicationRef = ref(database, `job-applications/${userId}/${id}`);
    
    // Update the application data
    await update(applicationRef, updatedData);

    return { id, userId, ...updatedData } as Application; // Return the updated application with all required properties
  } catch (error) {
    console.error('Error updating application:', error);
    throw new Error('Failed to update application');
  }
}


/**
 * Delete an application by ID using an API.
 *
 * @param id - The ID of the application to delete
 * @returns A Promise resolving to void upon successful deletion
 */
export async function deleteApplication(id: string): Promise<void> {
  return makeApiRequest<void>(`/api/job-applications/${id}`, 'DELETE');
}

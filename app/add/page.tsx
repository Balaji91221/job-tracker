'use client'; // Mark the file as a Client Component

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ApplicationForm } from '@/components/application-form';
import { createApplication } from '../actions';

export default function AddApplication() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleCreateApplication(formData: FormData) {
    setError(null); // Reset any previous errors
    setLoading(true);

    try {
      await createApplication(formData);
      // Navigate or show a success message
      router.push('/'); // Adjust route as needed
    } catch (err) {
      console.error('Failed to create application:', err);
      setError('Failed to create application. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100">
      <div className="container mx-auto py-10 px-4">
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <ApplicationForm
          onSubmit={handleCreateApplication}
          submitButtonText={loading ? 'Adding...' : 'Add Application'}
        />
      </div>
    </div>
  );
}

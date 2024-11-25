"use client";
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation'; // Updated import
import { Application } from '@/types/application';
import { getApplicationById, updateApplication } from '@/app/actions';
import { ApplicationForm } from '@/components/application-form'; // Import the ApplicationForm

export default function EditApplicationPage() {
  const [application, setApplication] = useState<Application | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id || null;  // Get the id from URL params

  // Fetch application data based on the ID
  useEffect(() => {
    if (id) {
      const fetchApplication = async () => {
        try {
          const app = await getApplicationById(id as string);
          setApplication(app);
          setIsLoading(false);
        } catch (error) {
          console.error('Failed to fetch application data:', error);
        }
      };

      fetchApplication();
    }
  }, [id]);

  // Handle form submission using the ApplicationForm
  const handleSubmit = async (formData: FormData) => {
    if (application) {
      try {
        const updatedApplication = await updateApplication(application.id, formData);
        console.log('Application updated successfully:', updatedApplication);
        router.push(`/`); // Navigate after successful update
      } catch (error) {
        console.error('Failed to update application:', error);
      }
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Edit Application</h1>
      {/* Pass existing application data and the handleSubmit function */}
      <ApplicationForm
        application={application || undefined}
        onSubmit={handleSubmit}
        submitButtonText="Update Application"
      />
    </div>
  );
}

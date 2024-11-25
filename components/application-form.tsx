'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Application } from '@/types/application';

interface ApplicationFormProps {
  application?: Application;
  onSubmit: (formData: FormData) => Promise<void>;
  submitButtonText: string;
}





export function ApplicationForm({ application, onSubmit, submitButtonText }: ApplicationFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    // Convert checkboxes to boolean values
    if (formData.get('approached') === 'on') {
      formData.set('approached', 'true');
    } else {
      formData.set('approached', 'false');
    }

    if (formData.get('heardBack') === 'on') {
      formData.set('heardBack', 'true');
    } else {
      formData.set('heardBack', 'false');
    }

    try {
      await onSubmit(formData);
    } catch (err) {
      setError('Failed to submit the application. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-md p-8 max-w-2xl mx-auto"
    >
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-blue-800">
            {application ? 'Edit Application' : 'Add New Application'}
          </h1>
          <p className="text-gray-600">
            {application ? 'Update the details of your job application' : 'Track a new job application contact'}
          </p>
        </div>

        {error && <p className="text-red-600">{error}</p>}

        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="companyName">Company Name</Label>
            <Input id="companyName" name="companyName" defaultValue={application?.companyName} required />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="companyWebsite">Company Website</Label>
            <Input id="companyWebsite" name="companyWebsite" type="url" defaultValue={application?.companyWebsite} required />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="employeeName">Employee Name</Label>
            <Input id="employeeName" name="employeeName" defaultValue={application?.employeeName} required />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="employeeEmail">Employee Email</Label>
            <Input id="employeeEmail" name="employeeEmail" type="email" defaultValue={application?.employeeEmail} required />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="linkedinProfile">LinkedIn Profile</Label>
            <Input id="linkedinProfile" name="linkedinProfile" type="url" defaultValue={application?.linkedinProfile} />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="approached" name="approached" defaultChecked={application?.approached} />
            <Label htmlFor="approached">Approached</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="heardBack" name="heardBack" defaultChecked={application?.heardBack} />
            <Label htmlFor="heardBack">Heard Back</Label>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="status">Status</Label>
            <Input id="status" name="status" defaultValue={application?.status || 'cold mail'} required />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="remarks">Remarks</Label>
            <Input id="remarks" name="remarks" defaultValue={application?.remarks} />
          </div>
        </div>

        <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
          {loading ? 'Submitting...' : submitButtonText}
        </Button>
      </form>
    </motion.div>
  );
}

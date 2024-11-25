"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Application } from "@/types/application";
import { deleteApplication } from "@/app/actions";
import Link from "next/link";
import { database, auth } from "@/lib/firebase";
import { ref, onValue, off, DataSnapshot } from "firebase/database";

export function ApplicationsTable({
  applications: initialApplications = [],
}: {
  applications?: Application[];
}) {
  const [applications, setApplications] = useState<Application[]>(initialApplications);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Fetch data from Firebase
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setError("No authenticated user found. Please log in.");
      setLoading(false);
      return;
    }

    const applicationsRef = ref(database, `job-applications/${user.uid}`);

    const handleData = (snapshot: DataSnapshot) => {
      try {
        if (snapshot.exists()) {
          const apps: Application[] = Object.entries(snapshot.val()).map(([key, value]) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { id, ...rest } = value as Application;
            return { id: key, ...rest };
          });
          setApplications(apps);
        } else {
          setApplications([]);
        }
        setError(null); // Clear previous errors, if any
      } catch (err) {
        setError("Failed to process application data.");
        console.error("Data processing error:", err);
      } finally {
        setLoading(false);
      }
    };

    // Set up listener
    onValue(applicationsRef, handleData, (err) => {
      setError("Failed to fetch applications data.");
      console.error("Firebase error:", err);
      setLoading(false);
    });

    // Cleanup listener on component unmount
    return () => {
      off(applicationsRef, "value", handleData);
    };
  }, []);

  // Handle delete action
  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this application?")) {
      try {
        await deleteApplication(id);
        router.refresh();
      } catch (err) {
        console.error("Error deleting application:", err);
        alert("Failed to delete application. Please try again.");
      }
    }
  };

  if (loading) {
    return <p className="text-center">Loading applications...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="rounded-md border bg-white overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Company</TableHead>
            <TableHead>Employee</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.length > 0 ? (
            applications.map((application) => (
              <TableRow key={application.id}>
                <TableCell>
                  <div>{application.companyName}</div>
                  <a
                    href={application.companyWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    {application.companyWebsite}
                  </a>
                </TableCell>
                <TableCell>
                  <div>{application.employeeName}</div>
                  <div className="text-sm text-gray-500">{application.employeeEmail}</div>
                  {application.linkedinProfile && (
                    <a
                      href={application.linkedinProfile}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      LinkedIn
                    </a>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant={application.approached ? "secondary" : "default"}>
                    {application.approached ? "Approached" : "Not Approached"}
                  </Badge>
                  <Badge
                    variant={application.heardBack ? "secondary" : "default"}
                    className="ml-2"
                  >
                    {application.heardBack ? "Heard Back" : "No Response"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Link href={`/edit/${application.id}`}>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(application.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                No applications found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

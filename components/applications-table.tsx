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
import { motion } from "framer-motion";

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
        setError(null);
      } catch (err) {
        setError("Failed to process application data.");
        console.error("Data processing error:", err);
      } finally {
        setLoading(false);
      }
    };

    onValue(applicationsRef, handleData, (err) => {
      setError("Failed to fetch applications data.");
      console.error("Firebase error:", err);
      setLoading(false);
    });

    return () => {
      off(applicationsRef, "value", handleData);
    };
  }, []);

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
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-lg border border-gray-200 bg-white overflow-hidden shadow-md"
    >
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="font-semibold text-indigo-800">Company</TableHead>
            <TableHead className="font-semibold text-indigo-800">Employee</TableHead>
            <TableHead className="font-semibold text-indigo-800">Status</TableHead>
            <TableHead className="font-semibold text-indigo-800">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.length > 0 ? (
            applications.map((application) => (
              <TableRow key={application.id} className="hover:bg-gray-50 transition-colors duration-150">
                <TableCell>
                  <div className="font-medium">{application.companyName}</div>
                  <a
                    href={application.companyWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-indigo-600 hover:text-indigo-800 transition-colors duration-150"
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
                      className="text-sm text-indigo-600 hover:text-indigo-800 transition-colors duration-150"
                    >
                      LinkedIn
                    </a>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant={application.approached ? "secondary" : "default"} className="mr-2">
                    {application.approached ? "Approached" : "Not Approached"}
                  </Badge>
                  <Badge variant={application.heardBack ? "secondary" : "default"}>
                    {application.heardBack ? "Heard Back" : "No Response"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Link href={`/edit/${application.id}`}>
                      <Button variant="outline" size="sm" className="text-indigo-600 hover:text-indigo-800 hover:border-indigo-800 transition-colors duration-150">
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(application.id)}
                      className="bg-red-500 hover:bg-red-600 transition-colors duration-150"
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                No applications found. Start by adding a new application!
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </motion.div>
  );
}

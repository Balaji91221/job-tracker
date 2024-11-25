"use client";
import { Button } from "@/components/ui/button"
import { ApplicationsTable } from "@/components/applications-table"
import { DashboardStats } from "@/components/dashboard-stats"
import { ResumeDownload } from "@/components/resume-download"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import Link from "next/link"

export default function Home() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100">
        <div className="container mx-auto py-10 px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-blue-800">Job Tracker Pro</h1>
              <p className="text-gray-600">Track and manage your job application outreach</p>
            </div>
            <Link href="/add">
              <Button className="bg-blue-600 hover:bg-blue-700">Add New Application</Button>
            </Link>
          </div>
          
          <DashboardStats />
          
          <div className="my-8">
            <h2 className="text-2xl font-semibold text-blue-800 mb-4">Your Applications</h2>
            <ApplicationsTable applications={[]} />
          </div>
          
          <ResumeDownload />
        </div>
      </div>
    </ProtectedRoute>
  )
}


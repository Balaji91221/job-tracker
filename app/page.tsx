"use client";

import { Button } from "@/components/ui/button"
import { ApplicationsTable } from "@/components/applications-table"
import { DashboardStats } from "@/components/dashboard-stats"
import { ResumeDownload } from "@/components/resume-download"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import Link from "next/link"
import { motion } from "framer-motion"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartBar, BriefcaseIcon, ClockIcon } from "lucide-react"

export default function Home() {
  const { signOut } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/login')
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
        <header className="bg-black/20 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-3xl font-bold text-white">Job Tracker Pro</h1>
            <div className="flex items-center space-x-4">
              <Link href="/add">
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                  Add Application
                </Button>
              </Link>
              <Button 
                onClick={handleSignOut}
                variant="outline"
                className="border-white/20 bg-indigo-600 text-white hover:bg-white/20"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Welcome to Your Job Search Dashboard</h2>
            <p className="text-xl text-gray-300">Track, manage, and optimize your job applications</p>
          </motion.div>
          
          <DashboardStats />
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="my-12"
          >
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-white">Your Applications</CardTitle>
              </CardHeader>
              <CardContent>
                <ApplicationsTable applications={[]} />
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          >
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-white flex items-center">
                  <ChartBar className="w-5 h-5 mr-2" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">Track your application progress and success rate</p>
              </CardContent>
            </Card>
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-white flex items-center">
                  <ClockIcon className="w-5 h-5 mr-2" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">View your latest applications and updates</p>
              </CardContent>
            </Card>
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-white flex items-center">
                  <BriefcaseIcon className="w-5 h-5 mr-2" />
                  Job Search Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">Get insights about your job search journey</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-white">Resume Management</CardTitle>
              </CardHeader>
              <CardContent>
                <ResumeDownload />
              </CardContent>
            </Card>
          </motion.div>
        </main>

        <footer className="bg-black/20 backdrop-blur-sm mt-12 py-6">
          <div className="container mx-auto px-4 text-center text-gray-400">
            <p>&copy; 2023 Job Tracker Pro. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </ProtectedRoute>
  )
}


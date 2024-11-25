'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Application } from '@/types/application'
import { database, auth } from '@/lib/firebase'
import { ref, onValue, off, DataSnapshot } from "firebase/database"

export function DashboardStats() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch data from Firebase when user is authenticated
  useEffect(() => {
    const user = auth.currentUser
    if (!user) {
      console.error("User not authenticated")
      setLoading(false)
      return
    }

    // Firebase path to the user's applications
    const applicationsRef = ref(database, `job-applications/${user.uid}`)
    
    // Handle the snapshot data
    const handleData = (snapshot: DataSnapshot) => {
      console.log("Firebase Snapshot:", snapshot.val())  // Log the snapshot data

      if (snapshot.exists()) {
        const apps: Application[] = []
        snapshot.forEach((childSnapshot: DataSnapshot) => {
          apps.push({
            id: childSnapshot.key,
            ...childSnapshot.val()
          })
        })
        console.log("Fetched Applications:", apps)  // Log the fetched applications
        setApplications(apps)
      } else {
        console.log("No applications found.")
        setApplications([])
      }
      setLoading(false)
    }

    // Listen for data changes in the Firebase database
    onValue(applicationsRef, handleData)

    // Cleanup listener when component unmounts or user changes
    return () => {
      off(applicationsRef, 'value', handleData)
    }
  }, [])

  // Display a loading spinner while data is being fetched
  if (loading) {
    return <div>Loading...</div>
  }

  // Calculate statistics based on fetched applications
  const totalApplications = applications.length
  const followUpsPending = applications.filter(app => !app.approached).length
  const responsesReceived = applications.filter(app => app.heardBack).length
  const companiesReached = applications.filter(app => app.approached).length

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
    >
      <StatCard title="Applications Sent" value={totalApplications} />
      <StatCard title="Follow-ups Pending" value={followUpsPending} />
      <StatCard title="Responses Received" value={responsesReceived} />
      <StatCard title="Companies Reached" value={companiesReached} />
    </motion.div>
  )
}

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <motion.div 
      whileHover={{ scale: 1.05 }}
      className="bg-white p-6 rounded-lg shadow-md"
    >
      <h3 className="text-lg font-semibold text-gray-700 mb-2">{title}</h3>
      <p className="text-3xl font-bold text-blue-600">{value}</p>
    </motion.div>
  )
}

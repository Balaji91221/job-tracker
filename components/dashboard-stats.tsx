'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Application } from '@/types/application'
import { database, auth } from '@/lib/firebase'
import { ref, onValue, off, DataSnapshot } from "firebase/database"

export function DashboardStats() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const user = auth.currentUser
    if (!user) {
      console.error("User not authenticated")
      setLoading(false)
      return
    }

    const applicationsRef = ref(database, `job-applications/${user.uid}`)
    
    const handleData = (snapshot: DataSnapshot) => {
      if (snapshot.exists()) {
        const apps: Application[] = []
        snapshot.forEach((childSnapshot: DataSnapshot) => {
          apps.push({
            id: childSnapshot.key,
            ...childSnapshot.val()
          })
        })
        setApplications(apps)
      } else {
        setApplications([])
      }
      setLoading(false)
    }

    onValue(applicationsRef, handleData)

    return () => {
      off(applicationsRef, 'value', handleData)
    }
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  const totalApplications = applications.length
  const followUpsPending = applications.filter(app => !app.approached).length
  const responsesReceived = applications.filter(app => app.heardBack).length
  const companiesReached = applications.filter(app => app.approached).length

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
    >
      <StatCard title="Applications Sent" value={totalApplications} color="indigo" />
      <StatCard title="Follow-ups Pending" value={followUpsPending} color="yellow" />
      <StatCard title="Responses Received" value={responsesReceived} color="green" />
      <StatCard title="Companies Reached" value={companiesReached} color="purple" />
    </motion.div>
  )
}

function StatCard({ title, value, color }: { title: string; value: number; color: string }) {
  const colorClasses = {
    indigo: "bg-indigo-100 border-indigo-300 text-indigo-800",
    yellow: "bg-yellow-100 border-yellow-300 text-yellow-800",
    green: "bg-green-100 border-green-300 text-green-800",
    purple: "bg-purple-100 border-purple-300 text-purple-800",
  }

  return (
    <motion.div 
      whileHover={{ scale: 1.05 }}
      className={`p-6 rounded-lg shadow-md border ${colorClasses[color as keyof typeof colorClasses]} transition-all duration-200`}
    >
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-3xl font-bold">{value}</p>
    </motion.div>
  )
}


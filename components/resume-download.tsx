'use client'

import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"

export function ResumeDownload() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white rounded-lg shadow-md p-6 mt-8"
    >
      <h2 className="text-2xl font-semibold text-blue-800 mb-4">Download Resume</h2>
      <p className="text-gray-600 mb-4">
        Get a copy of my latest resume to learn more about my skills and experience.
      </p>
      <Button 
        asChild
        className="bg-blue-600 hover:bg-blue-700"
      >
        <a href="/path-to-your-resume.pdf" download>
          Download Resume (PDF)
        </a>
      </Button>
    </motion.section>
  )
}


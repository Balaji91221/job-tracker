'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function Header() {
  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      <nav className="flex justify-between items-center">
        <motion.h1
          whileHover={{ scale: 1.05 }}
          className="text-3xl font-bold text-blue-600"
        >
          Job Tracker Pro
        </motion.h1>
        <ul className="flex space-x-4">
          <li>
            <Link href="/" className="text-blue-600 hover:text-blue-800">
              Home
            </Link>
          </li>
          <li>
            <Link href="/about" className="text-blue-600 hover:text-blue-800">
              About
            </Link>
          </li>
          <li>
            <Link href="/contact" className="text-blue-600 hover:text-blue-800">
              Contact
            </Link>
          </li>
        </ul>
      </nav>
    </motion.header>
  )
}


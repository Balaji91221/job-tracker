import { useEffect, useState } from 'react'
import { app } from '@/lib/firebase'

export function FirebaseStatus() {
  const [status, setStatus] = useState('Checking Firebase status...')

  useEffect(() => {
    if (app) {
      setStatus('Firebase initialized successfully')
    } else {
      setStatus('Firebase initialization failed')
    }
  }, [])

  return <div>{status}</div>
}


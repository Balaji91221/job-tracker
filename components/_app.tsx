import { AppProps } from 'next/app'
import { useEffect } from 'react'
import { app } from '@/lib/firebase'
import '@/styles/globals.css'

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // This ensures Firebase is initialized
    if (app) console.log('Firebase initialized')
  }, [])

  return <Component {...pageProps} />
}

export default MyApp


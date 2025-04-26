"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '@/firebase/firebase'
import { signInWithEmailLink, isSignInWithEmailLink } from 'firebase/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleAuthCallback = async () => {
      if (isSignInWithEmailLink(auth, window.location.href)) {
        let email = window.localStorage.getItem('emailForSignIn')
        if (!email) {
          email = window.prompt('Please provide your email for confirmation')
        }

        try {
          await signInWithEmailLink(auth, email!, window.location.href)
          window.localStorage.removeItem('emailForSignIn')
          router.push('/')
        } catch (error) {
          console.error('Error signing in with email link:', error)
          router.push('/auth')
        }
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center gap-4 p-6">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <p className="text-gray-600 dark:text-gray-400">Completing sign in...</p>
        </CardContent>
      </Card>
    </div>
  )
} 
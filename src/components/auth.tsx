"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LogIn, UserPlus, Loader2 } from "lucide-react";
import { auth, db, app, actionCodeSettings } from '@/firebase/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, updateProfile } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { getApps } from 'firebase/app';
import { sendSignInLinkToEmail } from '../firebase/firebase';

interface AuthProps {
  onLogin: (user: { name: string; email: string }) => void;
}

export function Auth({ onLogin }: AuthProps) {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [firebaseInitialized, setFirebaseInitialized] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Check if Firebase is initialized
    const apps = getApps();
    if (apps.length === 0) {
      setError('Firebase is not initialized. Please check your configuration.');
      return;
    }
    setFirebaseInitialized(true);

    // Check for existing session
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Get user data from Firestore
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            onLogin({ name: userData.name, email: user.email || '' });
            router.push('/');
          } else {
            // If user exists in auth but not in Firestore, create their Firestore record
            await setDoc(doc(db, 'users', user.uid), {
              name: user.displayName || 'User',
              email: user.email || '',
              createdAt: new Date().toISOString(),
              wellnessScores: [],
              meditationMinutes: 0,
              yogaSessions: 0,
              breathingExercises: 0
            });
            onLogin({ name: user.displayName || 'User', email: user.email || '' });
            router.push('/');
          }
        } catch (err: any) {
          console.error('Firestore error:', err);
          setError('Error accessing user data. Please try again.');
        }
      }
      setIsCheckingSession(false);
    });

    return () => unsubscribe();
  }, [router, onLogin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!firebaseInitialized) {
      setError('Firebase is not initialized. Please check your configuration.');
      setLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        // Create user with Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Set display name in Firebase Auth
        await updateProfile(user, { displayName: name });

        // Store additional user data in Firestore
        await setDoc(doc(db, 'users', user.uid), {
          name,
          email,
          photoURL: user.photoURL || '',
          createdAt: new Date().toISOString(),
          wellnessScores: [],
          meditationMinutes: 0,
          yogaSessions: 0,
          breathingExercises: 0
        });

        onLogin({ name, email });
        router.push('/');
      } else {
        // Sign in with Firebase Auth
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Get user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          onLogin({ name: userData.name, email: user.email || '' });
          router.push('/');
        } else {
          // If user exists in auth but not in Firestore, create their Firestore record
          await setDoc(doc(db, 'users', user.uid), {
            name: user.displayName || 'User',
            email: user.email || '',
            createdAt: new Date().toISOString(),
            wellnessScores: [],
            meditationMinutes: 0,
            yogaSessions: 0,
            breathingExercises: 0
          });
          onLogin({ name: user.displayName || 'User', email: user.email || '' });
          router.push('/');
        }
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Please sign in instead.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters long.');
      } else if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Invalid email or password.');
      } else if (err.code === 'auth/invalid-credential') {
        setError('User not found');
      } else {
        setError(err.message || 'An error occurred during authentication');
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordlessSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError(null);

    if (!email) {
      setError('Please enter your email address');
      setLoading(false);
      return;
    }

    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      setMessage('Sign-in link sent! Check your email.');
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('emailForSignIn', email);
      }
    } catch (error: any) {
      console.error('Error sending sign-in link:', error);
      if (error.code === 'auth/invalid-email') {
        setError('Please enter a valid email address');
      } else if (error.code === 'auth/user-disabled') {
        setError('This account has been disabled');
      } else {
        setError('Error sending sign-in link. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (isCheckingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <p className="text-gray-600 dark:text-gray-400">Checking session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-center">
            Serenity
          </h1>
          <CardTitle className="text-2xl font-bold text-center">
            {isSignUp ? 'Create an Account' : 'Welcome Back'}
          </CardTitle>
          <CardDescription className="text-center">
            {isSignUp 
              ? 'Join Serenity to start your wellness journey'
              : 'Sign in to continue your wellness journey'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-md">
                {error}
              </div>
            )}
            
            {isSignUp && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">
                  Full Name
                </label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Adharv Arun"
                  required
                  disabled={loading}
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="adharv@email.com"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={loading}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  {isSignUp ? (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Sign Up
                    </>
                  ) : (
                    <>
                      <LogIn className="mr-2 h-4 w-4" />
                      Sign In
                    </>
                  )}
                </>
              )}
            </Button>

            <div className="text-center text-sm">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                disabled={loading}
              >
                {isSignUp
                  ? 'Already have an account? Sign in'
                  : "Don't have an account? Sign up"}
              </button>
            </div>
          </form>

          <div className="mt-8">
            <Button
              onClick={handlePasswordlessSignIn}
              variant="outline"
              className="w-full"
              disabled={loading}
            >
              Use passwordless sign in
            </Button>
          </div>

          {message && (
            <p className={`mt-4 text-sm text-center ${message.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
              {message}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

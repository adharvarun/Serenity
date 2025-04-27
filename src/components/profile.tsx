"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { auth } from '@/firebase/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import { LogOut, ArrowLeft } from "lucide-react";
import Image from 'next/image';

interface UserProfile {
  name: string;
  email: string;
  photoURL?: string;
}

export function Profile() {
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUserProfile({
          name: user.displayName || '',
          email: user.email || '',
          photoURL: user.photoURL || '',
        });
      } else {
        router.push('/');
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.push('/');
    } catch (err) {
      setError('Failed to sign out');
    }
  };

  const handleChangePassword = async () => {
    if (!auth.currentUser?.email) return;
    try {
      await sendPasswordResetEmail(auth, auth.currentUser.email);
      setSuccess('Password reset email sent!');
    } catch (err) {
      setError('Failed to send password reset email');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!userProfile) {
    return <div className="p-8 text-center text-red-500">No profile found for this user.</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-center relative mb-2">
            <Button variant="ghost" size="icon" onClick={() => router.push('/')} className="absolute left-0">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <CardTitle className="text-2xl font-bold text-center flex-1">Profile</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && <div className="p-2 bg-red-100 text-red-700 rounded">{error}</div>}
          {success && <div className="p-2 bg-green-100 text-green-700 rounded">{success}</div>}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              {userProfile.photoURL ? (
                <Image
                  src={userProfile.photoURL}
                  alt="Profile"
                  width={120}
                  height={120}
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-blue-500 flex items-center justify-center text-white text-4xl">
                  {userProfile.name ? userProfile.name.charAt(0).toUpperCase() : "?"}
                </div>
              )}
            </div>
            <div className="w-full text-center">
              <div className="text-gray-600 dark:text-gray-400 text-xl font-bold">{userProfile.name || "No Name"}</div>
            </div>
            <div className="w-full text-center">
              <div className="text-gray-600 dark:text-gray-400">{userProfile.email}</div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Button onClick={handleChangePassword} variant="outline">Change Password</Button>
            <Button onClick={handleLogout} variant="destructive" className="w-full flex items-center gap-2 justify-center">
              <LogOut className="w-4 h-4" /> Logout
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 
"use client"

import { useState } from 'react';
import { sendSignInLinkToEmail, auth } from '../firebase/firebase';

interface PasswordlessSignInProps {
  onLogin: (user: { name: string; email: string }) => void;
}

export function PasswordlessSignIn({ onLogin }: PasswordlessSignInProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSendLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const actionCodeSettings = {
        url: process.env.WEBSITE_LINK || '/',
        handleCodeInApp: true,
      };
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      setMessage('Sign-in link sent! Check your email.');
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('emailForSignIn', email);
      }
    } catch (error) {
      console.error('Error sending sign-in link:', error);
      setMessage('Error sending sign-in link. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Sign in with Email Link</h2>
      <form onSubmit={handleSendLink} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Email address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isLoading ? 'Sending...' : 'Send Sign-in Link'}
        </button>
      </form>
      {message && (
        <p className={`mt-4 text-sm ${message.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
          {message}
        </p>
      )}
    </div>
  );
} 
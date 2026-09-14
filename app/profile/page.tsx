'use client';

import { useAuth } from '@/hooks/useAuth';

export default function ProfilePage() {
  const { user, loading, loginRedirect } = useAuth();

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-lg">Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center p-8 text-center mt-16">
        <div className="p-8 bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-sm">
          <h3 className="text-2xl font-bold mb-4">Authentication Required</h3>
          <p className="text-zinc-600 dark:text-zinc-400 mb-6 max-w-md">
            Please sign in using the main CVEnhance application to access your profile.
          </p>
          <button
            onClick={loginRedirect}
            className="bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-md font-semibold transition-transform hover:scale-105"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 mt-16">
      <div className="p-8 bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-sm w-full max-w-lg">
        <h3 className="text-3xl font-bold mb-6 border-b pb-4 dark:border-zinc-800">Your Profile</h3>
        <div className="space-y-4 text-lg">
          <p><span className="font-semibold text-zinc-500">Name:</span> {user.name}</p>
          <p><span className="font-semibold text-zinc-500">Email:</span> {user.email}</p>
          <p><span className="font-semibold text-zinc-500">ID:</span> {user.id}</p>
        </div>
        <div className="mt-8 p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded border border-green-200 dark:border-green-800 font-medium">
          Successfully authenticated via shared JWT cookie!
        </div>
      </div>
    </div>
  );
}


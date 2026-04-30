"use client";

import { useState, useEffect } from "react";
import { auth, signInWithGoogle, logout } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { LogIn, LogOut, User as UserIcon } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export const GoogleAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const { t } = useLanguage();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    await signInWithGoogle();
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="flex items-center gap-3">
      {user ? (
        <div className="flex items-center gap-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-3 py-1.5 rounded-full shadow-sm">
          <img 
            src={user.photoURL || ""} 
            alt={user.displayName || "User"} 
            className="w-6 h-6 rounded-full border border-gray-200 dark:border-gray-600"
          />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200 hidden sm:inline">
            {user.displayName}
          </span>
          <button 
            onClick={handleLogout}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-500 hover:text-red-500"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <button
          onClick={handleLogin}
          className="flex items-center gap-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 shadow-sm transition-all text-sm font-semibold"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-4 h-4" />
          <span>Login with Google</span>
        </button>
      )}
    </div>
  );
};

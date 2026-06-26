import React from 'react';
import { supabase } from '../lib/supabase';
import { LogIn, AlertCircle } from 'lucide-react';

export default function Login({ authError }: { authError?: string | null }) {
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
        queryParams: {
          prompt: 'select_account',
          hd: 'iub.edu.bd'
        }
      }
    });
    if (error) {
      console.error('Error logging in:', error.message);
      // fallback for preview without keys
      if (error.message.includes('not found') || error.message.includes('fetch')) {
         alert('Supabase keys are not configured. Proceeding in preview mode.');
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <div className="glass-panel p-8 md:p-12 w-full max-w-md text-center">
        <h1 className="text-4xl font-bold mb-4">Jukti Club</h1>
        <p className="text-white/80 mb-8 font-medium">CSE IUB Chapter Registration</p>
        
        {authError && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-100 px-4 py-3 rounded-lg mb-6 flex items-start text-left gap-3">
            <AlertCircle className="shrink-0 mt-0.5" size={18} />
            <p className="text-sm">{authError}</p>
          </div>
        )}

        <button
          onClick={handleGoogleLogin}
          className="flex items-center justify-center w-full gap-3 bg-white text-brand-dark px-6 py-4 rounded-xl font-semibold hover:bg-white/90 transition-all"
        >
          <LogIn size={20} />
          Sign in with Google
        </button>
      </div>
    </div>
  );
}

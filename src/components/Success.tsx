import React from 'react';
import { PartyPopper } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Success({ user }: { user: any }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <div className="glass-panel p-8 md:p-12 w-full max-w-md text-center flex flex-col items-center">
        <div className="bg-brand-orange/20 p-4 rounded-full mb-6 text-brand-orange">
          <PartyPopper size={48} />
        </div>
        
        <h1 className="text-3xl font-bold mb-4">Registration Complete!</h1>
        <p className="text-white/80 mb-6">
          Congratulations, {user?.user_metadata?.full_name || 'Member'}! You have successfully registered for the Jukti Club.
        </p>

        <a 
          href="https://m.me/j/YOUR_MESSENGER_GROUP_LINK" 
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-blue-700 transition-colors mb-6"
        >
          Join our Messenger Group
        </a>
        
        <button
          onClick={() => supabase.auth.signOut()}
          className="text-white/60 hover:text-white underline text-sm"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}

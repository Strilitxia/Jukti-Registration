import React, { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';
import Login from './components/Login';
import RegistrationForm from './components/RegistrationForm';
import Success from './components/Success';
import { Loader2 } from 'lucide-react';
import logoImg from './assets/logo.png';

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    // Check for errors returned in the URL hash from Supabase OAuth
    if (window.location.hash) {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const errorDesc = hashParams.get('error_description') || hashParams.get('error');
      if (errorDesc) {
        setAuthError(decodeURIComponent(errorDesc).replace(/\+/g, ' '));
      }
    }

    const initAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
           console.error("getSession error:", error);
           if (mounted) setAuthError(error.message);
        }
        
        if (mounted) {
          setSession(data?.session || null);
          await checkRegistration(data?.session);
        }
      } catch (err: any) {
        console.error("Auth init exception:", err);
        if (mounted) {
          setAuthError(err.message || 'An error occurred during authentication.');
          setSession(null);
          setLoading(false);
        }
      }
    };

    initAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (mounted) {
        setSession(session);
        await checkRegistration(session);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const checkRegistration = async (currentSession: any) => {
    if (!currentSession || !currentSession.user) {
      setLoading(false);
      return;
    }

    if (currentSession.user.email && !currentSession.user.email.endsWith('@iub.edu.bd')) {
      await supabase.auth.signOut();
      setAuthError('Only @iub.edu.bd email addresses are allowed.');
      setLoading(false);
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('members')
        .select('id')
        .eq('id', currentSession.user.id)
        .maybeSingle();
        
      if (error) {
        console.error("Check registration DB error:", error);
      }
      
      if (data) {
        setIsRegistered(true);
      } else {
        setIsRegistered(false);
      }
    } catch (err: any) {
      console.error("Check registration exception:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-brand-orange" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden font-sans">
      {/* Background shapes for glassmorphism */}
      <div className="absolute top-[-100px] left-[-100px] w-96 h-96 bg-brand-orange/30 rounded-full blur-3xl mix-blend-screen opacity-50 animate-pulse pointer-events-none"></div>
      <div className="absolute bottom-[-100px] right-[-100px] w-96 h-96 bg-red-600/20 rounded-full blur-3xl mix-blend-screen opacity-50 pointer-events-none"></div>

      <header className="absolute top-0 w-full z-20 p-6 flex flex-col md:flex-row items-center justify-center gap-4 fade-in">
        <div className="bg-white/10 p-2 rounded-2xl backdrop-blur-md shadow-xl border border-white/10 shadow-brand-orange/20">
           <img src={logoImg} alt="JUKTI Logo" className="h-16 w-16 object-contain" fallback="JUKTI" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-center tracking-tight animate-gradient-x text-shadow-sm">
          JUKTI - Club of CSE, IUB
        </h1>
      </header>

      <div className="relative z-10 container mx-auto pt-32">
        {!session ? (
          <Login authError={authError} />
        ) : isRegistered ? (
          <Success user={session.user} />
        ) : (
          <RegistrationForm 
            user={session.user} 
            onSuccess={() => setIsRegistered(true)} 
          />
        )}
      </div>
    </div>
  );
}

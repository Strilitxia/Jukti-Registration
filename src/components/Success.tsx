import React, { useState, useEffect } from 'react';
import { PartyPopper } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'motion/react';
import mascotImg from '../assets/mascot.png';

export default function Success({ user }: { user: any }) {
  const [animationState, setAnimationState] = useState<'left' | 'none' | 'right'>('left');

  useEffect(() => {
    // Leave left side after 2.5 seconds
    const leaveTimer = setTimeout(() => {
      setAnimationState('none');
    }, 2500);

    // Enter right side after 3 seconds
    const enterTimer = setTimeout(() => {
      setAnimationState('right');
    }, 3000);

    return () => {
      clearTimeout(leaveTimer);
      clearTimeout(enterTimer);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 overflow-hidden">
      <div className="glass-panel p-8 md:p-12 w-full max-w-md text-center flex flex-col items-center z-10">
        <div className="bg-brand-orange/20 p-4 rounded-full mb-6 text-brand-orange">
          <PartyPopper size={48} />
        </div>
        
        <h1 className="text-3xl font-bold mb-4">Registration Complete!</h1>
        <p className="text-white/80 mb-6">
          Congratulations, {user?.user_metadata?.full_name || 'Member'}! You have successfully registered for the Jukti Club.
        </p>

        <a 
          href="https://m.me/j/AbaVhJ91fsJcATCY" 
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

      <AnimatePresence>
        {animationState === 'left' && (
          <div className="fixed -bottom-5 -left-2 md:-bottom-8 md:-left-8 z-30 pointer-events-none flex items-end">
            <div className="relative">
              <motion.div 
                initial={{ opacity: 0, scale: 0.5, x: -20, y: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                exit={{ opacity: 0, scale: 0.5, x: -20, y: 20, transition: { delay: 0 } }}
                transition={{ type: 'spring', delay: 0.7, bounce: 0.5 }}
                className="absolute -top--12 left-23 md:-top-20 md:left-32 bg-white text-brand-dark px-3 py-2 md:px-5 md:py-3 rounded-xl md:rounded-2xl rounded-bl-sm shadow-2xl border-2 border-brand-orange font-bold text-sm md:text-xl whitespace-nowrap z-40"
              >
                Welcome to Juktiverse! 🎉
              </motion.div>
              
              <motion.div
                initial={{ y: 200, x: -100, rotate: 0 }}
                animate={{ y: 0, x: 0, rotate: 45 }}
                exit={{ y: 200, x: -100, rotate: 0, transition: { delay: 0 } }}
                transition={{ type: 'spring', delay: 0.2, bounce: 0.4 }}
              >
                <img 
                  src={mascotImg} 
                  alt="Jukti Mascot" 
                  className="w-24 md:w-56 h-auto object-contain drop-shadow-2xl -scale-x-100 translate-y-4 -translate-x-4 md:translate-y-12 md:-translate-x-12"
                />
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {animationState === 'right' && (
          <div className="fixed top-4/11 -right-13 md:-right-8 -translate-y-1/2 z-30 pointer-events-none flex items-center">
            <div className="relative">
              <motion.div 
                initial={{ opacity: 0, scale: 0.5, x: 20, y: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                transition={{ type: 'spring', delay: 0.8, bounce: 0.5 }}
                className="absolute -top-8 right-20 md:-top-16 md:right-32 bg-white text-brand-dark px-3 py-2 md:px-5 md:py-3 rounded-xl md:rounded-2xl rounded-br-sm shadow-2xl border-2 border-brand-orange font-bold text-sm md:text-xl whitespace-nowrap z-40"
              >
                Can't wait to see you at our club! 
              </motion.div>
              
              <motion.div
                initial={{ x: 200, rotate: 0 }}
                animate={{ x: 0, rotate: -45 }}
                transition={{ type: 'spring', bounce: 0.4 }}
              >
                <img 
                  src={mascotImg} 
                  alt="Jukti Mascot" 
                  className="w-24 md:w-56 h-auto object-contain drop-shadow-2xl -translate-x-4 md:-translate-x-12"
                />
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

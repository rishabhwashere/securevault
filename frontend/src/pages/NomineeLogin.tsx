import React, { useState, useEffect } from 'react';
import { ShieldAlert, Mail, ArrowRight, Loader2, Lock, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/auth.store'; 

export default function NomineeLogin() {
  const [formData, setFormData] = useState({ ownerEmail: '', nomineeEmail: '', nomineePin: '' });
  const [status, setStatus] = useState<'idle' | 'pending' | 'denied'>('idle');
  const [ownerId, setOwnerId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const navigate = useNavigate();
  const authStore = useAuthStore((state: any) => state); // Grab the store actions

  // 1. Submit Form to trigger email
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setStatus('pending'); 
    
    try {
      const response = await fetch('/api/nominee/request-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData })
      });
      const res = await response.json();
      
      if (res.success && res.status === 'pending') {
        setOwnerId(res.ownerId); // Save ID to start polling
      } else {
        setStatus('idle');
        setErrorMessage(res.message || "Login failed. Check your PIN.");
      }
    } catch (error) {
      setStatus('idle');
      setErrorMessage("Server error. Please try again later.");
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (status === 'pending' && ownerId) {
      interval = setInterval(async () => {
        try {
          const response = await fetch(`/api/nominee/status/${ownerId}`);
          const res = await response.json();
          
          if (res.status === 'approved') {
            clearInterval(interval);
            
            localStorage.setItem('token', res.token);
            try {
              // Try standard Zustand direct override first
              if (typeof (useAuthStore as any).setState === 'function') {
                (useAuthStore as any).setState({ token: res.token, user: res.user, isAuthenticated: true });
              }
              if (authStore.setAuth) authStore.setAuth({ user: res.user, token: res.token });
              if (authStore.setCredentials) authStore.setCredentials({ user: res.user, token: res.token });
              if (authStore.login) authStore.login(res.user, res.token);
            } catch (e) {
              console.warn("Global state update fallback activated.");
            }
            navigate('/vault'); 
            
          } else if (res.status === 'denied') {
            clearInterval(interval);
            setStatus('denied');
          }
        } catch (error) {
          console.error("Polling error", error);
        }
      }, 3000); 
    }
    
    return () => clearInterval(interval);
  }, [status, ownerId, navigate, authStore]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 dark:bg-gray-900">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="h-16 w-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
            <ShieldAlert className="h-8 w-8 text-red-600 dark:text-red-500" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">Emergency Access</h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-200 dark:border-gray-700 min-h-[300px] relative">
          <AnimatePresence mode="wait">
            
            {status === 'idle' && (
              <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-5" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Vault Owner's Email</label>
                  <div className="mt-1 relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input type="email" required value={formData.ownerEmail} onChange={(e) => setFormData({...formData, ownerEmail: e.target.value})} className="pl-10 block w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-red-500" placeholder="owner@example.com" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Your Email (Nominee)</label>
                  <div className="mt-1 relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input type="email" required value={formData.nomineeEmail} onChange={(e) => setFormData({...formData, nomineeEmail: e.target.value})} className="pl-10 block w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-red-500" placeholder="you@example.com" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nominee PIN</label>
                  <div className="mt-1 relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input type="password" required maxLength={4} value={formData.nomineePin} onChange={(e) => setFormData({...formData, nomineePin: e.target.value})} className="pl-10 block w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-red-500" placeholder="Enter your 4-digit PIN" />
                  </div>
                </div>

                {errorMessage && <div className="p-3 rounded-md text-sm bg-red-50 text-red-700">{errorMessage}</div>}

                <button type="submit" className="w-full flex justify-center py-2.5 px-4 rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors">
                  <span className="flex items-center gap-2">Request Secure Access <ArrowRight className="h-4 w-4" /></span>
                </button>
              </motion.form>
            )}

            {status === 'pending' && (
              <motion.div key="pending" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center text-center py-10">
                <Loader2 className="animate-spin text-red-600 dark:text-red-500 h-14 w-14 mb-6" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Waiting for Approval...</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">An email has been sent to the owner. Waiting for them to click "Approve".</p>
              </motion.div>
            )}

            {status === 'denied' && (
              <motion.div key="denied" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center text-center py-10">
                <XCircle className="text-red-600 dark:text-red-500 h-16 w-16 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Access Denied</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-8">The vault owner has rejected this access request.</p>
                <button onClick={() => { setStatus('idle'); setFormData({ ...formData, nomineePin: '' }); }} className="px-6 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-md transition-colors">Try Again</button>
              </motion.div>
            )}

          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
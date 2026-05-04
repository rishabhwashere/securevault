import React, { useState } from 'react';
import { ShieldAlert, Mail, ArrowRight, Loader2, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

export default function NomineeLogin() {
  const [formData, setFormData] = useState({ ownerEmail: '', nomineeEmail: '', nomineePin: '' });
  const [status, setStatus] = useState<'idle' | 'pending'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setStatus('pending'); // Show loading spinner briefly
    
    try {
      // Hit our public backend route directly
      const response = await fetch('http://localhost:5000/api/nominee/request-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData })
      });
      
      const res = await response.json();
      
      if (res.success && res.token) {
        // ✨ PIN was correct! Save token and go to vault
        localStorage.setItem('token', res.token);
        navigate('/vault'); 
      } else {
        setStatus('idle');
        setErrorMessage(res.message || "Login failed. Check your PIN.");
      }
    } catch (error) {
      setStatus('idle');
      setErrorMessage("Server error. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 dark:bg-gray-900">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="h-16 w-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
            <ShieldAlert className="h-8 w-8 text-red-600 dark:text-red-500" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          Emergency Access
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Request vault access as a registered nominee
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-200 dark:border-gray-700 min-h-[300px] relative"
        >
          <AnimatePresence mode="wait">
            
            {/* STATE 1: IDLE (The Form) */}
            {status === 'idle' && (
              <motion.form 
                key="form"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="space-y-5" 
                onSubmit={handleSubmit}
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Vault Owner's Email
                  </label>
                  <div className="mt-1 relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      required
                      value={formData.ownerEmail}
                      onChange={(e) => setFormData({...formData, ownerEmail: e.target.value})}
                      className="pl-10 block w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-red-500 transition-shadow"
                      placeholder="owner@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Your Email (Nominee)
                  </label>
                  <div className="mt-1 relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      required
                      value={formData.nomineeEmail}
                      onChange={(e) => setFormData({...formData, nomineeEmail: e.target.value})}
                      className="pl-10 block w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-red-500 transition-shadow"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Nominee PIN
                  </label>
                  <div className="mt-1 relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="password"
                      required
                      maxLength={4}
                      value={formData.nomineePin}
                      onChange={(e) => setFormData({...formData, nomineePin: e.target.value})}
                      className="pl-10 block w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-red-500 transition-shadow"
                      placeholder="Enter your 4-digit PIN"
                    />
                  </div>
                </div>

                {errorMessage && (
                  <div className="p-3 rounded-md text-sm bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/30 dark:border-red-800 dark:text-red-400">
                    {errorMessage}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                >
                  <span className="flex items-center gap-2">Request Secure Access <ArrowRight className="h-4 w-4" /></span>
                </button>
              </motion.form>
            )}

            {/* STATE 2: PENDING (Loading state while verifying PIN) */}
            {status === 'pending' && (
              <motion.div 
                key="pending"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center text-center py-10"
              >
                <Loader2 className="animate-spin text-red-600 dark:text-red-500 h-14 w-14 mb-6" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Verifying Credentials...
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Checking PIN and establishing a secure connection.
                </p>
              </motion.div>
            )}

          </AnimatePresence>

          {/* Persistent Return Link */}
          {status === 'idle' && (
            <div className="mt-6 text-center">
              <Link to="/" className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 transition-colors">
                Return to main login
              </Link>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
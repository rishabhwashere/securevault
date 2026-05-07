import React, { useState, useEffect } from 'react';
import { ShieldAlert, UserPlus, Trash2, Mail, User, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/features/auth/auth.store';

export function NomineePage() {
  const [hasNominee, setHasNominee] = useState(false);
  const [nomineeName, setNomineeName] = useState('');
  const [nomineeEmail, setNomineeEmail] = useState('');
  const [nomineePin, setNomineePin] = useState(''); 
  const token = useAuthStore((state) => state.token);
  const API_URL = '/api/nominee'; 

  useEffect(() => {
    const fetchNominee = async () => {
      try {
        const response = await fetch(API_URL, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const json = await response.json();
        
        if (json.success && json.data?.isConfigured) {
          setHasNominee(true);
          setNomineeName(json.data.name);
          setNomineeEmail(json.data.email);
        }
      } catch (error) {
        console.error("Failed to fetch nominee:", error);
      }
    };
    
    if (token) fetchNominee();
  }, [token]);

  const handleSaveNominee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nomineeName || !nomineeEmail || !nomineePin) return; 

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name: nomineeName, email: nomineeEmail, pin: nomineePin }) 
      });
      const json = await response.json();

      if (json.success) {
        setHasNominee(true);
      }
    } catch (error) {
      console.error("Failed to save nominee:", error);
    }
  };

  const handleRevokeAccess = async () => {
    try {
      const response = await fetch(API_URL, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const json = await response.json();

      if (json.success) {
        setHasNominee(false);
        setNomineeName('');
        setNomineeEmail('');
        setNomineePin(''); 
      }
    } catch (error) {
      console.error("Failed to revoke nominee:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-4 sm:mt-8">
      <div className="mb-8 text-center sm:text-left">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center justify-center sm:justify-start gap-2">
          <ShieldAlert className="h-7 w-7 text-blue-600" />
          Emergency Nominee
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm sm:text-base">
          Designate a trusted person to access your VaultX account in case of an emergency. 
          If they request access, you will be alerted immediately.
        </p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden"
      >
        {hasNominee ? (
          <div className="p-6">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-6 mb-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <ShieldCheck className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Active Nominee</h3>
                  <p className="text-sm text-green-600 dark:text-green-400 font-medium">Protection is enabled</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                <User className="h-5 w-5 text-gray-400" />
                <span className="font-medium">{nomineeName}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                <Mail className="h-5 w-5 text-gray-400" />
                <span>{nomineeEmail}</span>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
              <button 
                onClick={handleRevokeAccess}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-900/20 dark:hover:bg-red-900/40 dark:text-red-400 rounded-lg font-medium transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                Revoke Access
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6 border-b border-gray-100 dark:border-gray-700 pb-6">
               <div className="h-12 w-12 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                  <UserPlus className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Add a Nominee</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">They will receive an email instruction.</p>
                </div>
            </div>

            <form onSubmit={handleSaveNominee} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g., Jane Doe"
                  value={nomineeName}
                  onChange={(e) => setNomineeName(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                <input 
                  type="email" 
                  required
                  placeholder="jane@example.com"
                  value={nomineeEmail}
                  onChange={(e) => setNomineeEmail(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white"
                />
              </div>

              {}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Secret PIN</label>
                <input 
                  type="text" 
                  required
                  maxLength={4}
                  placeholder="e.g. 1234"
                  value={nomineePin}
                  onChange={(e) => setNomineePin(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white"
                />
                <p className="text-xs text-gray-500 mt-1">Give this PIN to your nominee in real life.</p>
              </div>

              <div className="pt-4 border-t border-gray-100 dark:border-gray-700 mt-6">
                <button 
                  type="submit"
                  className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="h-5 w-5" />
                  Save Nominee
                </button>
              </div>
            </form>
          </div>
        )}
      </motion.div>
    </div>
  );
}
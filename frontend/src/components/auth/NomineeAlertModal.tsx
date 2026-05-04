import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import {requestJson as request} from '../../lib/request'; // Assuming this is your axios instance

const NomineeAlertModal = ({ userId }) => {
  const [alertData, setAlertData] = useState<any>(null);

  useEffect(() => {
    // Initialize socket
    const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000');
    
    socket.emit('register_user', userId);

    socket.on('nominee_login_attempt', (data) => {
      setAlertData(data);
    });

    return () => {
      socket.disconnect();
    };
  }, [userId]);

  const handleResolve = async (action: 'allow' | 'deny') => {
    try {
      await request.post('/api/auth/resolve-nominee', { action });
      setAlertData(null); // Close modal
    } catch (error) {
      console.error("Failed to resolve request", error);
    }
  };

  if (!alertData) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
        <h2 className="text-xl font-bold text-red-600 mb-4">🚨 Unrecognized Login Attempt</h2>
        <p className="mb-4">
          Your designated nominee is trying to access your VaultX account.
        </p>
        <div className="bg-gray-100 p-3 rounded mb-6 text-sm">
          <p><strong>Device:</strong> {alertData.deviceInfo}</p>
          <p><strong>Time:</strong> {new Date(alertData.timestamp).toLocaleString()}</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => handleResolve('allow')}
            className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            Yes, Allow Access
          </button>
          <button 
            onClick={() => handleResolve('deny')}
            className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700"
          >
            No, Deny & Secure
          </button>
        </div>
      </div>
    </div>
  );
};

export default NomineeAlertModal;
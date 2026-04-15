import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

export function SharedItemPage() {
  // 1. Grab the secure token from the URL (/shared/e0ee043...)
  const { token } = useParams<{ token: string }>();
  
  // 2. Set up our state variables
  const [password, setPassword] = useState('');
  const [vaultData, setVaultData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 3. The function that runs when you click "Unlock"
  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return toast.error('Please enter a password');

    setIsLoading(true);
    try {
      // NOTE: This URL might need to change depending on what Amoolya named the 
      // access route in the backend (e.g., /api/share/access/:token vs /api/share/:token)
      const response = await fetch(`/api/share/access/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Incorrect password or link expired');
      }

      // Success! Save the unlocked data to state so we can show it
      setVaultData(data);
      toast.success('Vault unlocked!');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // --- VIEW 1: WHAT IT SHOWS AFTER YOU UNLOCK IT ---
if (vaultData) {
  // We grab the first file in the array (index 0)
  const attachedImages = vaultData.files || [];
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-background">
      <div className="w-full max-w-2xl bg-panel border border-line rounded-xl p-8 shadow-soft">
        <h1 className="text-2xl font-bold text-textPrimary mb-6">{vaultData.title}</h1>

        {/* THE FIX: Loop through the files array to show the image(s) */}
        {attachedImages.length > 0 && (
          <div className="mb-6 w-full flex flex-col gap-4 items-center bg-background rounded-lg border border-line p-2">
            {attachedImages.map((url: string, index: number) => (
              <img 
                key={index}
                src={url} 
                alt={`Attachment ${index + 1}`} 
                className="max-h-96 w-auto rounded object-contain"
              />
            ))}
          </div>
        )}

        <div className="bg-background border border-line p-4 rounded-lg text-textSecondary whitespace-pre-wrap">
          {vaultData.data || "No additional text provided."}
        </div>
      </div>
    </div>
  );
}

  // --- VIEW 2: THE LOCKED PASSWORD SCREEN (Default) ---
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-background text-center">
      <div className="w-full max-w-md bg-panel border border-line rounded-xl p-8 shadow-soft">
        <h1 className="text-2xl font-bold mb-2 text-textPrimary">Encrypted Vault Item</h1>
        <p className="text-textSecondary mb-6 text-sm">
          This item is secured. Enter the password to decrypt and view the contents.
        </p>

        <form onSubmit={handleUnlock} className="flex flex-col gap-4">
          <input
            type="password"
            placeholder="Enter password..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-background border border-line text-textPrimary focus:outline-none focus:border-primary transition-colors"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Unlocking...' : 'Unlock Vault'}
          </button>
        </form>
      </div>
    </div>
  );
}
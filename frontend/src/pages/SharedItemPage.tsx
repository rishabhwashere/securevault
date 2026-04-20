import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

export function SharedItemPage() {
  const { token } = useParams<{ token: string }>();

  const [password, setPassword] = useState('');
  const [vaultData, setVaultData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return toast.error('Please enter a password');

    setIsLoading(true);
    try {
      const response = await fetch(`/api/share/access/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      const textResponse = await response.text();
      let jsonResponse;
      try {
        jsonResponse = JSON.parse(textResponse);
      } catch (err) {
        console.error("Server returned non-JSON:", textResponse);
        throw new Error("Server communication error. Check your Vite proxy settings.");
      }

      if (!response.ok) {
        throw new Error(jsonResponse.message || 'Incorrect password or link expired');
      }

      if (!jsonResponse.data) {
        throw new Error("No data received from vault.");
      }

      setVaultData(jsonResponse.data); 
      toast.success('Vault unlocked!');
    } catch (error: any) {
      toast.error(error.message);
      console.error('Unlock error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (url: string) => {
    try {
      if (url.includes('cloudinary.com') && url.includes('/upload/')) {
        const downloadUrl = url.replace('/upload/', '/upload/fl_attachment/');
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return;
      }

      const response = await fetch(url);
      const blob = await response.blob();
      const objectUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = url.substring(url.lastIndexOf('/') + 1) || 'vault-attachment';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(objectUrl);
    } catch (error) {
      toast.error('Failed to download the file');
      console.error('Download error:', error);
    }
  };

  if (vaultData) {
    const title = typeof vaultData.title === 'string' ? vaultData.title : "Shared Item";
    
    let attachedImages: string[] = [];
    if (Array.isArray(vaultData.files)) {
        attachedImages = vaultData.files;
    } else if (typeof vaultData.files === 'string') {
        attachedImages = [vaultData.files];
    }

    let displayData = "No additional text provided.";
    if (vaultData.data) {
        displayData = typeof vaultData.data === 'string' 
            ? vaultData.data 
            : JSON.stringify(vaultData.data, null, 2);
    }

    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-background">
        <div className="w-full max-w-2xl bg-panel border border-line rounded-xl p-8 shadow-soft">
          <h1 className="text-2xl font-bold text-textPrimary mb-6">{title}</h1>

          {attachedImages.length > 0 && (
            <div className="mb-6 w-full flex flex-col gap-6 items-center bg-background rounded-lg border border-line p-4">
              <h3 className="font-medium text-textSecondary self-start">Attached Files:</h3>
              
              {attachedImages.map((url: string, index: number) => (
                <div key={index} className="flex flex-col items-center gap-3 w-full bg-panel p-3 rounded-lg border border-line">
                  <img 
                    src={url} 
                    alt={`Attachment ${index + 1}`} 
                    className="max-h-96 w-auto rounded object-contain"
                    onError={(e) => {
                      // Hide broken image links rather than showing a cracked image icon
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  
                  <button 
                    onClick={() => handleDownload(url)}
                    className="flex items-center justify-center px-4 py-2 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-md transition-colors text-sm font-medium border border-primary/20 w-full sm:w-auto"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download File
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="bg-background border border-line p-4 rounded-lg text-textSecondary whitespace-pre-wrap break-all font-mono text-sm">
            {displayData}
          </div>
        </div>
      </div>
    );
  }

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
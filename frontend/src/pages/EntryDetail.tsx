import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Copy, ExternalLink, FileText, Link as LinkIcon, User, Key, File } from 'lucide-react';
import toast from 'react-hot-toast';
import { useVaultEntry, useVaultShareLinks, useCreateShareLink } from '@/features/vault/useVault'; // ✨ Imported the create hook!

export const EntryDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // ✨ NEW: State to handle the inline share form
  const [isSharing, setIsSharing] = useState(false);
  const [sharePassword, setSharePassword] = useState('');
  const [selectedFile, setSelectedFile] = useState('');

  const { data: entry, isLoading, isError } = useVaultEntry(id);
  const { data: shareLinks = [] } = useVaultShareLinks(id);
  const createLinkMutation = useCreateShareLink(id as string); // ✨ Initialize the mutation

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center p-8 text-textMuted animate-pulse">
        Decrypting entry details...
      </div>
    );
  }

  if (isError || !entry) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 p-8 text-red-400">
        <p>Entry not found or access denied.</p>
        <button onClick={() => navigate('/vault')} className="text-brand hover:underline">
          Return to Dashboard
        </button>
      </div>
    );
  }

  const copyToClipboard = (text: string, label: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const getFileUrl = (path: string) => {
    if (!path) return '#';
    if (path.startsWith('http')) return path; 
    const cleanPath = path.replace(/\\/g, '/');
    const baseUrl = 'http://localhost:5000'; 
    return `${baseUrl}/${cleanPath.startsWith('/') ? cleanPath.slice(1) : cleanPath}`;
  };

  // ✨ NEW: Handle the submit button for the new link
  const handleCreateLink = async () => {
    if (!selectedFile) {
      toast.error('Please select an attachment to share');
      return;
    }
    if (sharePassword.length < 4) {
      toast.error('Password must be at least 4 characters');
      return;
    }

    await createLinkMutation.mutateAsync({
      filePath: selectedFile,
      password: sharePassword
    });

    // Reset form after successful creation
    setIsSharing(false);
    setSharePassword('');
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-4 md:p-8">
      {/* Header Section */}
      <div className="flex items-center gap-4 border-b border-line pb-6">
        <button 
          onClick={() => navigate('/vault')} 
          className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-surface-raised transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-textMuted" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-textPrimary md:text-3xl">{entry.title}</h1>
          <span className="mt-2 inline-block rounded-full bg-brand/10 px-3 py-1 text-xs font-medium text-brand">
            {entry.category || 'General'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Credentials Section */}
        {(entry.username || entry.password || entry.url) && (
          <div className="rounded-xl border border-line bg-panel p-6 shadow-soft md:col-span-2">
            <h3 className="mb-4 text-lg font-semibold text-textPrimary">Credentials</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {entry.username && (
                <div className="flex items-center justify-between rounded-lg border border-line bg-surface-soft p-3">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <User className="h-4 w-4 text-textMuted shrink-0" />
                    <span className="truncate text-sm text-textPrimary">{entry.username}</span>
                  </div>
                  <button onClick={() => copyToClipboard(entry.username, 'Username')} className="text-textMuted hover:text-brand p-1">
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              )}
              {entry.password && (
                <div className="flex items-center justify-between rounded-lg border border-line bg-surface-soft p-3">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <Key className="h-4 w-4 text-textMuted shrink-0" />
                    <span className="truncate text-sm text-textPrimary">••••••••</span>
                  </div>
                  <button onClick={() => copyToClipboard(entry.password, 'Password')} className="text-textMuted hover:text-brand p-1">
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              )}
              {entry.url && (
                <div className="flex items-center justify-between rounded-lg border border-line bg-surface-soft p-3">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <LinkIcon className="h-4 w-4 text-textMuted shrink-0" />
                    <a href={entry.url} target="_blank" rel="noreferrer" className="truncate text-sm text-brand hover:underline">
                      {entry.url}
                    </a>
                  </div>
                  <button onClick={() => copyToClipboard(entry.url, 'URL')} className="text-textMuted hover:text-brand p-1">
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Notes / Data Section */}
        {(entry.notes || entry.data) && (
          <div className="rounded-xl border border-line bg-panel p-6 shadow-soft md:col-span-2">
            <h3 className="mb-4 text-lg font-semibold text-textPrimary">Secure Notes</h3>
            <div className="rounded-lg border border-line bg-surface-soft p-4">
              <p className="whitespace-pre-wrap text-sm text-textPrimary leading-relaxed">
                {entry.notes || entry.data}
              </p>
            </div>
          </div>
        )}

        {/* Attachments Section */}
        {entry.filePath && entry.filePath.length > 0 && (
          <div className="rounded-xl border border-line bg-panel p-6 shadow-soft md:col-span-2">
            <h3 className="mb-4 text-lg font-semibold text-textPrimary">Attachments</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              {entry.filePath.map((path: string, index: number) => (
                <a 
                  key={index} 
                  href={getFileUrl(path)}
                  target="_blank" 
                  rel="noreferrer" 
                  className="flex items-center justify-between rounded-lg border border-line bg-surface-soft p-3 transition-colors hover:border-brand group"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <File className="h-5 w-5 text-brand shrink-0" />
                    <span className="truncate text-sm text-textPrimary group-hover:text-brand">
                      Attachment {index + 1}
                    </span>
                  </div>
                  <ExternalLink className="h-4 w-4 text-textMuted group-hover:text-brand shrink-0" />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Active Share Links Section */}
        <div className="rounded-xl border border-line bg-panel p-6 shadow-soft md:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-textPrimary">Active Share Links</h3>
            <button 
              onClick={() => {
                if (!entry.filePath || entry.filePath.length === 0) {
                  toast.error('You must have at least one attachment to create a share link.');
                  return;
                }
                setSelectedFile(entry.filePath[0]);
                setIsSharing(!isSharing);
              }}
              className="text-sm font-medium text-brand hover:underline"
            >
              {isSharing ? 'Cancel' : '+ Generate New Link'}
            </button>
          </div>
          
          {/* ✨ NEW: Inline form to collect the password */}
          {isSharing && (
            <div className="mb-6 rounded-lg border border-line bg-surface-soft p-4">
              <h4 className="mb-3 text-sm font-semibold text-textPrimary">Create Secure Link</h4>
              <div className="space-y-4">
                {entry.filePath && entry.filePath.length > 1 && (
                  <div>
                    <label className="mb-1 block text-xs text-textMuted">Select File to Share</label>
                    <select
                      value={selectedFile}
                      onChange={(e) => setSelectedFile(e.target.value)}
                      className="w-full rounded-md border border-line bg-panel p-2 text-sm text-textPrimary outline-none focus:border-brand"
                    >
                      {entry.filePath.map((path: string, i: number) => (
                        <option key={i} value={path}>Attachment {i + 1}</option>
                      ))}
                    </select>
                  </div>
                )}
                <div>
                  <label className="mb-1 block text-xs text-textMuted">Set Link Password (min 4 chars)</label>
                  <input
                    type="password"
                    value={sharePassword}
                    onChange={(e) => setSharePassword(e.target.value)}
                    placeholder="Enter a secure password..."
                    className="w-full rounded-md border border-line bg-panel p-2 text-sm text-textPrimary outline-none focus:border-brand"
                  />
                </div>
                <button
                  onClick={handleCreateLink}
                  disabled={createLinkMutation.isPending}
                  className="w-full rounded-md bg-brand py-2 text-sm font-medium text-white transition hover:bg-brand/90 disabled:opacity-50"
                >
                  {createLinkMutation.isPending ? 'Generating...' : 'Generate Share Link'}
                </button>
              </div>
            </div>
          )}

          {shareLinks.length === 0 ? (
            <div className="rounded-lg border border-line bg-surface-soft p-4 text-center">
              <p className="text-sm text-textMuted">No active share links for this entry.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {shareLinks.map((link: any, index: number) => (
                <div key={index} className="flex flex-col gap-2 rounded-lg border border-line bg-surface-soft p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <LinkIcon className="h-5 w-5 text-brand shrink-0" />
                    <div>
                      <p className="truncate text-sm font-medium text-textPrimary">Secure Link {index + 1}</p>
                      <p className="text-xs text-textMuted">
                        {link.expiresAt ? `Expires: ${new Date(link.expiresAt).toLocaleDateString()}` : 'Never expires'}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => copyToClipboard(`http://localhost:5173/shared/${link.shareId || link.urlToken}`, 'Share Link')} 
                    className="flex items-center gap-2 rounded-md bg-surface-raised px-3 py-1.5 text-xs font-medium text-textPrimary transition hover:text-brand"
                  >
                    <Copy className="h-3 w-3" /> Copy URL
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { Copy, Ellipsis, Eye, FileText, Pencil, Share2, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Badge } from '@/components/ui';
import { copyToClipboard, formatRelativeTime, maskValue, truncate } from '@/lib/utils';
import { categoryPalette } from '@/lib/constants';
import type { VaultEntry } from '@/features/vault/vault.types';

// The perfectly matching import for your service file!
import { generateShareLink } from '@/features/vault/vault.service';

interface VaultCardProps {
  entry: VaultEntry;
  index: number;
  onView: (id: string) => void;
  onEdit: (entry: VaultEntry) => void;
  onDelete: (entry: VaultEntry) => void;
}

export function VaultCard({ entry, index, onView, onEdit, onDelete }: VaultCardProps) {
  const [revealed, setRevealed] = useState(false);
  void index;

  useEffect(() => {
    if (!revealed) return;
    const timer = window.setTimeout(() => setRevealed(false), 15000);
    return () => window.clearTimeout(timer);
  }, [revealed]);
  const handleShare = async (event: React.MouseEvent) => {
    event.stopPropagation();
    
    const password = window.prompt(`Set a password to share "${entry.title}":`);
    if (!password) return;

    try {
      // 1. The Ultimate Token Hunt
      let token = localStorage.getItem('token') || '';
      
      // If it's not in 'token', check inside the 'user' object just in case!
      if (!token) {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          token = JSON.parse(storedUser).token || '';
        }
      }
      
      // Clean up the token
      token = token.replace(/['"]+/g, '');

      // 2. The Safety Check (If this pops up, your browser forgot your login!)
      if (!token) {
        toast.error("You are missing a security token! Please log out and log back in.");
        return;
      }

      // 3. Send the request
      const response = await generateShareLink(token, entry._id, password);
      const shareUrl = `${window.location.origin}${response.link}`;
      
      const copied = await copyToClipboard(shareUrl);
      if (copied) {
        toast.success('Share link copied to clipboard!');
      } else {
        window.prompt('Link generated! Copy it below:', shareUrl);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to generate share link');
    }
  };

  const categoryClass = categoryPalette[entry.category] ?? categoryPalette.General;

  return (
    <article
      role="article"
      aria-label={`${entry.title} entry`}
      className="group glass-panel flex cursor-pointer flex-col gap-5 rounded-lg border border-line bg-panel/95 p-5 shadow-soft transition-all duration-200 hover:-translate-y-1 hover:border-brand/30 hover:shadow-card"
      onClick={() => onView(entry._id)}
    >
        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between gap-4">
            <Badge className={categoryClass}>{entry.category || 'General'}</Badge>
            <Menu as="div" className="relative">
              <MenuButton
                onClick={(event) => event.stopPropagation()}
                className="focus-ring rounded-full p-2 text-textMuted opacity-0 transition group-hover:opacity-100 hover:bg-white/70 hover:text-brand"
                aria-label="Entry actions"
              >
                <Ellipsis className="h-4 w-4" />
              </MenuButton>
              <MenuItems
                anchor="bottom end"
                className="z-[70] mt-2 min-w-[180px] rounded-xl border border-line bg-panel p-2 shadow-card backdrop-blur-panel"
              >
                <MenuItem>
                  {({ focus }) => (
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        onView(entry._id);
                      }}
                      className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm ${focus ? 'bg-white/70 text-brand' : 'text-textPrimary'}`}
                    >
                      <Eye className="h-4 w-4" />
                      View
                    </button>
                  )}
                </MenuItem>
                <MenuItem>
                  {({ focus }) => (
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        onEdit(entry);
                      }}
                      className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm ${focus ? 'bg-white/70 text-brand' : 'text-textPrimary'}`}
                    >
                      <Pencil className="h-4 w-4" />
                      Edit
                    </button>
                  )}
                </MenuItem>
                <MenuItem>
                  {({ focus }) => (
                    <button
                      type="button"
                      onClick={async (event) => {
                        event.stopPropagation();
                        const copied = await copyToClipboard(entry.password || '');
                        if (copied) toast.success('Password copied');
                      }}
                      className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm ${focus ? 'bg-white/70 text-brand' : 'text-textPrimary'}`}
                    >
                      <Copy className="h-4 w-4" />
                      Copy password
                    </button>
                  )}
                </MenuItem>
                
                <MenuItem>
                  {({ focus }) => (
                    <button
                      type="button"
                      onClick={handleShare}
                      className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm ${
                        focus ? 'bg-white/70 text-brand' : 'text-textPrimary'
                      }`}
                    >
                      <Share2 className="h-4 w-4" />
                      Share Securely
                    </button>
                  )}
                </MenuItem>

                <MenuItem>
                  {({ focus }) => (
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        onDelete(entry);
                      }}
                      className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm ${focus ? 'bg-danger/10' : ''} text-danger`}
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  )}
                </MenuItem>
              </MenuItems>
            </Menu>
          </div>

          <div className="min-w-0 space-y-2">
            <h3 className="truncate font-heading text-xl font-semibold text-textPrimary">{entry.title}</h3>
            <p className="line-clamp-1 text-sm text-textMuted">
              {entry.username || entry.url || truncate(entry.notes || entry.data || 'No subtitle yet', 52)}
            </p>
          </div>
        </div>

        <div className="border-t border-line/80 pt-4">
          <div className="flex flex-wrap items-center gap-3 text-sm text-textMuted">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/60 px-3 py-1.5">
              <FileText className="h-4 w-4 text-brand" />
              {entry.filePath?.length ?? 0} files
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/60 px-3 py-1.5">
              {formatRelativeTime(entry.updatedAt || entry.createdAt)}
            </span>
            {entry.password ? (
              <div className="inline-flex items-center gap-2 rounded-full bg-white/60 px-3 py-1.5 text-textPrimary">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={revealed ? 'revealed' : 'hidden'}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="font-medium"
                  >
                    {maskValue(entry.password, revealed)}
                  </motion.span>
                </AnimatePresence>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    setRevealed((value) => !value);
                  }}
                  className="focus-ring rounded-full p-1 text-textMuted hover:text-brand"
                  aria-label={revealed ? 'Hide password' : 'Reveal password'}
                >
                  <Eye className="h-4 w-4" />
                </button>
                {revealed ? (
                  <button
                    type="button"
                    aria-label="Copy revealed password"
                    className="focus-ring rounded-full p-1 text-textMuted hover:text-brand"
                    onClick={async (event) => {
                      event.stopPropagation();
                      const copied = await copyToClipboard(entry.password || '');
                      if (copied) toast.success('Password copied');
                    }}
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </article>
  );
}
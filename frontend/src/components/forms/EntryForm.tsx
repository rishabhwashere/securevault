import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import { motion } from 'framer-motion';
import { Copy, Eye, EyeOff, Globe, Link2, Sparkles, X } from 'lucide-react';
import { Fragment, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Button, Input, Textarea } from '@/components/ui';
import { defaultCategories } from '@/lib/constants';
import { slideRight } from '@/lib/motion';
import { copyToClipboard, normalizeUrl, parseTags } from '@/lib/utils';
import { entrySchema, type EntryValues } from '@/lib/validators';
import type { VaultEntry } from '@/features/vault/vault.types';
import { FileUpload } from './FileUpload';
import { PasswordGenerator } from './PasswordGenerator';

interface EntryFormProps {
  open: boolean;
  mode: 'create' | 'edit';
  entry?: VaultEntry;
  onClose: () => void;
  onSubmit: (payload: {
    title: string;
    category: string;
    url?: string;
    username?: string;
    password?: string;
    notes?: string;
    data?: string;
    tags?: string[];
    files?: File[];
  }) => Promise<void>;
}

export function EntryForm({ open, mode, entry, onClose, onSubmit }: EntryFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const form = useForm<EntryValues>({
    resolver: zodResolver(entrySchema),
    defaultValues: {
      title: '',
      category: 'General',
      url: '',
      username: '',
      password: '',
      notes: '',
      tagsText: ''
    }
  });

  useEffect(() => {
    if (!entry) {
      form.reset({
        title: '',
        category: 'General',
        url: '',
        username: '',
        password: '',
        notes: '',
        tagsText: ''
      });
      setFiles([]);
      return;
    }

    form.reset({
      title: entry.title,
      category: entry.category || 'General',
      url: entry.url || '',
      username: entry.username || '',
      password: entry.password || '',
      notes: entry.notes || entry.data || '',
      tagsText: entry.tags?.join(', ') || ''
    });
    setFiles([]);
  }, [entry, form, open]);

  const categories = useMemo(() => {
    const current = form.watch('category');
    return Array.from(new Set([...defaultCategories, current].filter(Boolean)));
  }, [form]);

  async function handleSubmit(values: EntryValues) {
    await onSubmit({
      title: values.title,
      category: values.category,
      url: values.url || '',
      username: values.username || '',
      password: values.password || '',
      notes: values.notes || '',
      data: values.notes || '',
      tags: parseTags(values.tagsText || ''),
      files
    });
    onClose();
  }

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-[75]" onClose={onClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-textPrimary/30 backdrop-blur-sm" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex w-screen max-w-full justify-end">
              <DialogPanel
                as={motion.div}
                {...slideRight}
                className="pointer-events-auto relative flex h-full w-full max-w-2xl flex-col border-l border-line bg-panel shadow-card backdrop-blur-panel sm:max-w-lg"
              >
                <div className="flex items-start justify-between border-b border-line px-6 py-5">
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-textMuted">
                      {mode === 'create' ? 'Create entry' : 'Edit entry'}
                    </p>
                    <h3 className="mt-2 font-heading text-3xl text-textPrimary">
                      {mode === 'create' ? 'Capture something important' : 'Refine vault details'}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={onClose}
                    className="focus-ring rounded-full p-2 text-textMuted transition hover:bg-white/70 hover:text-brand"
                    aria-label="Close panel"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={form.handleSubmit(handleSubmit)} className="flex min-h-0 flex-1 flex-col">
                  <div className="scrollbar-thin flex-1 space-y-8 overflow-y-auto px-6 py-6">
                    <section className="space-y-4">
                      <p className="text-xs uppercase tracking-[0.22em] text-textMuted">Basic info</p>
                      <Input
                        label="Title"
                        placeholder="Acme workspace"
                        error={form.formState.errors.title?.message}
                        {...form.register('title')}
                      />
                      <label className="grid gap-2 text-sm text-textMuted">
                        <span className="text-xs font-medium uppercase tracking-[0.22em]">Category</span>
                        <input
                          list="vault-categories"
                          className="focus-ring rounded-md border border-line bg-white/60 px-3 py-2.5 text-sm text-textPrimary transition placeholder:text-textMuted/70 focus:border-brand focus:shadow-focus"
                          placeholder="Choose or create a category"
                          {...form.register('category')}
                        />
                        <datalist id="vault-categories">
                          {categories.map((category) => (
                            <option key={category} value={category} />
                          ))}
                        </datalist>
                      </label>
                      <Input
                        label="URL / website"
                        placeholder="https://"
                        error={form.formState.errors.url?.message}
                        rightAdornment={
                          <button
                            type="button"
                            className="focus-ring rounded-full p-1 text-textMuted transition hover:text-brand"
                            aria-label="Visit website"
                            onClick={() => {
                              const url = form.getValues('url');
                              if (!url) return;
                              window.open(normalizeUrl(url), '_blank', 'noopener,noreferrer');
                            }}
                          >
                            <Globe className="h-4 w-4" />
                          </button>
                        }
                        {...form.register('url')}
                      />
                    </section>

                    <section className="space-y-4 border-t border-line pt-6">
                      <p className="text-xs uppercase tracking-[0.22em] text-textMuted">Credentials</p>
                      <Input
                        label="Username / email"
                        placeholder="alex@company.com"
                        error={form.formState.errors.username?.message}
                        rightAdornment={
                          <button
                            type="button"
                            className="focus-ring rounded-full p-1 text-textMuted transition hover:text-brand"
                            aria-label="Copy username"
                            onClick={async () => {
                              const value = form.getValues('username');
                              if (await copyToClipboard(value || '')) toast.success('Username copied');
                            }}
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                        }
                        {...form.register('username')}
                      />
                      <div className="grid gap-2">
                        <Input
                          label="Password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Sensitive value"
                          error={form.formState.errors.password?.message}
                          rightAdornment={
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                className="focus-ring rounded-full p-1 text-textMuted transition hover:text-brand"
                                onClick={() => setShowPassword((value) => !value)}
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                              >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </button>
                              <button
                                type="button"
                                className="focus-ring rounded-full p-1 text-textMuted transition hover:text-brand"
                                aria-label="Copy password"
                                onClick={async () => {
                                  const value = form.getValues('password');
                                  if (await copyToClipboard(value || '')) toast.success('Password copied');
                                }}
                              >
                                <Copy className="h-4 w-4" />
                              </button>
                            </div>
                          }
                          {...form.register('password')}
                        />
                        <div className="flex justify-end">
                          <PasswordGenerator
                            onUse={(password) => form.setValue('password', password, { shouldDirty: true })}
                          />
                        </div>
                      </div>
                    </section>

                    <section className="space-y-4 border-t border-line pt-6">
                      <p className="text-xs uppercase tracking-[0.22em] text-textMuted">Notes</p>
                      <Textarea
                        label="Secure notes"
                        placeholder="Markdown-style notes, recovery steps, context, or internal documentation."
                        error={form.formState.errors.notes?.message}
                        {...form.register('notes')}
                      />
                      <Input
                        label="Tags"
                        placeholder="finance, shared, urgent"
                        error={form.formState.errors.tagsText?.message}
                        leftAdornment={<Link2 className="h-4 w-4 text-textMuted" />}
                        {...form.register('tagsText')}
                      />
                    </section>

                    <section className="space-y-4 border-t border-line pt-6">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-accent" />
                        <p className="text-xs uppercase tracking-[0.22em] text-textMuted">File attachments</p>
                      </div>
                      <FileUpload files={files} onChange={setFiles} existingFiles={entry?.filePath} />
                    </section>
                  </div>

                  <div className="sticky bottom-0 flex items-center justify-end gap-3 border-t border-line bg-panel/95 px-6 py-4 backdrop-blur-panel">
                    <Button type="button" variant="ghost" onClick={onClose}>
                      Cancel
                    </Button>
                    <Button type="submit">{mode === 'create' ? 'Save entry' : 'Save changes'}</Button>
                  </div>
                </form>
              </DialogPanel>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

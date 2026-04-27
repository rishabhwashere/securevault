import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRelativeTime(dateLike?: string | Date | null) {
  if (!dateLike) return 'Just now';
  const value = typeof dateLike === 'string' ? new Date(dateLike) : dateLike;
  const diff = value.getTime() - Date.now();
  const formatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

  const ranges: Array<[Intl.RelativeTimeFormatUnit, number]> = [
    ['year', 1000 * 60 * 60 * 24 * 365],
    ['month', 1000 * 60 * 60 * 24 * 30],
    ['week', 1000 * 60 * 60 * 24 * 7],
    ['day', 1000 * 60 * 60 * 24],
    ['hour', 1000 * 60 * 60],
    ['minute', 1000 * 60],
    ['second', 1000]
  ];

  for (const [unit, ms] of ranges) {
    if (Math.abs(diff) >= ms || unit === 'second') {
      return formatter.format(Math.round(diff / ms), unit);
    }
  }

  return 'Just now';
}

export function formatDateTime(dateLike?: string | Date | null) {
  if (!dateLike) return 'Not available';
  const value = typeof dateLike === 'string' ? new Date(dateLike) : dateLike;
  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(value);
}

export function isUnlockPending(unlockAt?: string | Date | null) {
  if (!unlockAt) return false;
  const value = typeof unlockAt === 'string' ? new Date(unlockAt) : unlockAt;

  if (Number.isNaN(value.getTime())) {
    return false;
  }

  return value.getTime() > Date.now();
}

export function toDateTimeInputValue(dateLike?: string | Date | null) {
  if (!dateLike) return '';

  const value = typeof dateLike === 'string' ? new Date(dateLike) : dateLike;

  if (Number.isNaN(value.getTime())) {
    return '';
  }

  const pad = (part: number) => String(part).padStart(2, '0');

  return `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())}T${pad(value.getHours())}:${pad(value.getMinutes())}`;
}

export function truncate(text: string, max = 120) {
  if (text.length <= max) return text;
  return `${text.slice(0, max).trim()}...`;
}

export async function copyToClipboard(value: string) {
  if (!value) return false;
  await navigator.clipboard.writeText(value);
  return true;
}

export function getInitials(name = 'Vault User') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

export function maskValue(value: string, visible = false) {
  if (visible) return value;
  return '\u2022'.repeat(Math.max(8, value.length));
}

export function normalizeUrl(url: string) {
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;
  return `https://${url}`;
}

export function parseTags(value: string) {
  return value
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export type AttachmentKind = 'image' | 'pdf' | 'file';

export function getAttachmentKindFromContentType(contentType?: string | null): AttachmentKind | null {
  const normalized = (contentType || '').toLowerCase();

  if (normalized.includes('application/pdf')) return 'pdf';
  if (normalized.startsWith('image/')) return 'image';
  return null;
}

export function getAttachmentKind(fileUrl: string) {
  if (/\.pdf(?:$|\?)/i.test(fileUrl)) return 'pdf';
  if (/\.(png|jpe?g|webp|gif|bmp|svg)(?:$|\?)/i.test(fileUrl)) return 'image';
  return 'file';
}

export async function detectAttachmentKind(fileUrl: string): Promise<AttachmentKind> {
  try {
    const headResponse = await fetch(fileUrl, { method: 'HEAD' });
    const fromHead = getAttachmentKindFromContentType(headResponse.headers.get('content-type'));

    if (headResponse.ok && fromHead) {
      return fromHead;
    }
  } catch {
    // Fall back to URL-based detection below.
  }

  return getAttachmentKind(fileUrl);
}

function getExtensionFromContentType(contentType: string) {
  const normalized = contentType.toLowerCase();

  if (normalized.includes('application/pdf')) return 'pdf';
  if (normalized.includes('image/jpeg')) return 'jpg';
  if (normalized.includes('image/png')) return 'png';
  if (normalized.includes('image/webp')) return 'webp';
  if (normalized.includes('image/gif')) return 'gif';
  if (normalized.includes('image/bmp')) return 'bmp';
  if (normalized.includes('image/svg+xml')) return 'svg';

  return '';
}

function getExtensionFromUrl(fileUrl: string) {
  const match = fileUrl.match(/\.([a-z0-9]+)(?:$|\?)/i);
  return match?.[1]?.toLowerCase() ?? '';
}

async function saveFetchedResource(response: Response, baseName: string, fallbackUrl = '') {
  if (!response.ok) {
    throw new Error('Unable to download attachment');
  }

  const blob = await response.blob();
  const contentType = response.headers.get('content-type') || blob.type || '';
  const extension = getExtensionFromContentType(contentType) || getExtensionFromUrl(fallbackUrl) || 'bin';
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = objectUrl;
  link.download = `${baseName}.${extension}`;
  document.body.appendChild(link);
  link.click();
  link.remove();

  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
}

export async function downloadAttachment(fileUrl: string, baseName: string) {
  const response = await fetch(fileUrl);
  await saveFetchedResource(response, baseName, fileUrl);
}

export async function downloadProtectedResource(resourceUrl: string, baseName: string, init?: RequestInit) {
  const response = await fetch(resourceUrl, init);
  await saveFetchedResource(response, baseName, resourceUrl);
}

export async function fetchProtectedResourceBlobUrl(resourceUrl: string, init?: RequestInit) {
  const response = await fetch(resourceUrl, init);

  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    throw new Error(payload?.message || 'Unable to load protected resource');
  }

  const blob = await response.blob();

  return {
    contentType: response.headers.get('content-type') || blob.type || '',
    objectUrl: URL.createObjectURL(blob)
  };
}

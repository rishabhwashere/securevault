import { requestJson } from '@/lib/request';

// ==========================================
// ✨ SMART DATA PACKAGER (The Magic Fix)
// ==========================================
const prepareData = (data: any) => {
  // If it's already packaged correctly, let it through
  if (data instanceof FormData) return data;

  // Scan the data to see if any actual File objects are hidden inside
  const hasFiles = Object.values(data).some(
    (val: any) => 
      val instanceof FileList || 
      (Array.isArray(val) && val.length > 0 && val[0] instanceof File) ||
      val instanceof File
  );

  // If there are no files attached, standard JSON is perfectly fine!
  if (!hasFiles) return data;

  // If files exist, JSON will destroy them. We MUST package it as FormData.
  const formData = new FormData();
  
  Object.keys(data).forEach((key) => {
    const value = data[key];
    
    // Skip empty fields
    if (value === undefined || value === null || value === '') return;

    // 1. Target the files and FORCE them into the 'files' field so Multer finds them
    if (value instanceof FileList || (Array.isArray(value) && value[0] instanceof File)) {
      Array.from(value).forEach((file: any) => formData.append('files', file));
    } else if (value instanceof File) {
      formData.append('files', value);
    } 
    // 2. Safely handle array fields (like your tags)
    else if (Array.isArray(value)) {
      value.forEach((item) => formData.append(key, item));
    } 
    // 3. Handle normal text and booleans
    else {
      formData.append(key, String(value));
    }
  });

  return formData;
};

// ==========================================
// ACTIVE API CALLS
// ==========================================

export const getVaultEntries = async () => {
  const response: any = await requestJson('/api/vault/entries', {
    method: 'GET',
  });
  return response.data || [];
};

export const getVaultEntry = async (id: string) => {
  const response: any = await requestJson(`/api/vault/${id}`, {
    method: 'GET',
  });
  return response.data;
};

export const createVaultEntry = async (arg1: any, arg2?: any) => {
  const entryData = typeof arg1 === 'string' && arg1.includes('eyJ') ? arg2 : arg1;
  
  // Pass the data through our new smart packager
  const finalData = prepareData(entryData);
  const isFormData = finalData instanceof FormData;

  return await requestJson('/api/vault/entries', {
    method: 'POST',
    // We let the browser set the headers if it's FormData
    headers: isFormData ? undefined : { 'Content-Type': 'application/json' },
    body: isFormData ? finalData : JSON.stringify(finalData),
  });
};

export const updateVaultEntry = async (id: string, entryData: any) => {
  const finalData = prepareData(entryData);
  const isFormData = finalData instanceof FormData;
  
  return await requestJson(`/api/vault/${id}`, {
    method: 'PUT',
    headers: isFormData ? undefined : { 'Content-Type': 'application/json' },
    body: isFormData ? finalData : JSON.stringify(finalData),
  });
};

export const deleteVaultEntry = async (id: string) => {
  return await requestJson(`/api/vault/${id}`, {
    method: 'DELETE',
  });
};

// ✨ NEW: Fetch active share links for this entry
export const getVaultShareLinks = async (id: string) => {
  const response: any = await requestJson(`/api/vault/${id}/share-links`, {
    method: 'GET',
  });
  return response.data || [];
};

// ✨ NEW: Generate a new share link
export const createShareLink = async (id: string, payload: any) => {
  return await requestJson(`/api/vault/${id}/share-link`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};

// ==========================================
// STUBBED FUNCTIONS 
// ==========================================
export const approveEntryAccess = async () => {};
export const requestEntryApproval = async () => {};
export const generateShareLink = async () => {};
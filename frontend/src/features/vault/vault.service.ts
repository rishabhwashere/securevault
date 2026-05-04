import { requestJson } from '@/lib/request';
const prepareData = (data: any) => {
  if (data instanceof FormData) return data;

  const hasFiles = Object.values(data).some(
    (val: any) => 
      val instanceof FileList || 
      (Array.isArray(val) && val.length > 0 && val[0] instanceof File) ||
      val instanceof File
  );

  if (!hasFiles) return data;

  const formData = new FormData();
  
  Object.keys(data).forEach((key) => {
    const value = data[key];
    
    if (value === undefined || value === null || value === '') return;

    if (value instanceof FileList || (Array.isArray(value) && value[0] instanceof File)) {
      Array.from(value).forEach((file: any) => formData.append('files', file));
    } else if (value instanceof File) {
      formData.append('files', value);
    } 
    else if (Array.isArray(value)) {
      value.forEach((item) => formData.append(key, item));
    } 
    else {
      formData.append(key, String(value));
    }
  });

  return formData;
};

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
  const finalData = prepareData(entryData);
  const isFormData = finalData instanceof FormData;

  return await requestJson('/api/vault/entries', {
    method: 'POST',
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
export const getVaultShareLinks = async (id: string) => {
  const response: any = await requestJson(`/api/vault/${id}/share-links`, {
    method: 'GET',
  });
  return response.data || [];
};
export const createShareLink = async (id: string, payload: any) => {
  return await requestJson(`/api/vault/${id}/share-link`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};
export const approveEntryAccess = async () => {};
export const requestEntryApproval = async () => {};
export const generateShareLink = async () => {};
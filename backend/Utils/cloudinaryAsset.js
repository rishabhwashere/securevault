const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

function parseStoredAsset(value) {
  if (!value || typeof value !== 'string') {
    return null;
  }

  try {
    const parsed = JSON.parse(value);

    if (parsed && typeof parsed === 'object' && typeof parsed.url === 'string') {
      return parsed;
    }
  } catch {
    // Stored value is a plain URL; continue below.
  }

  return null;
}

function parseCloudinaryUrl(filePath) {
  if (!filePath || typeof filePath !== 'string') {
    return null;
  }

  let parsedUrl;

  try {
    parsedUrl = new URL(filePath);
  } catch {
    return null;
  }

  if (!/cloudinary\.com$/i.test(parsedUrl.hostname)) {
    return null;
  }

  const segments = parsedUrl.pathname.split('/').filter(Boolean);

  if (segments.length < 5) {
    return null;
  }

  const resourceType = segments[1];
  const deliveryType = segments[2];
  const versionIndex = segments.findIndex((segment, index) => index >= 3 && /^v\d+$/.test(segment));
  const publicIdSegments = versionIndex >= 0 ? segments.slice(versionIndex + 1) : segments.slice(3);

  if (!resourceType || !deliveryType || publicIdSegments.length === 0) {
    return null;
  }

  const rawPublicId = decodeURIComponent(publicIdSegments.join('/'));
  const extensionMatch = rawPublicId.match(/\.([a-z0-9]+)$/i);
  const format = extensionMatch?.[1]?.toLowerCase() || '';
  const publicId = format ? rawPublicId.slice(0, -(format.length + 1)) : rawPublicId;

  return {
    url: filePath,
    resourceType,
    type: deliveryType,
    publicId,
    format
  };
}

function getCloudinaryAssetDescriptor(filePath) {
  const parsedValue = parseStoredAsset(filePath);

  if (parsedValue) {
    return {
      url: parsedValue.url,
      resourceType: parsedValue.resourceType || 'auto',
      type: parsedValue.type || 'upload',
      publicId: parsedValue.publicId || '',
      format: parsedValue.format || ''
    };
  }

  return parseCloudinaryUrl(filePath);
}

function getFetchableUrl(filePath) {
  const asset = getCloudinaryAssetDescriptor(filePath);

  if (!asset?.publicId || !asset?.format) {
    return filePath;
  }

  const expiresAt = Math.floor(Date.now() / 1000) + 60 * 5;

  try {
    return cloudinary.utils.private_download_url(asset.publicId, asset.format, {
      resource_type: asset.resourceType === 'auto' ? 'raw' : asset.resourceType,
      type: asset.type || 'upload',
      expires_at: expiresAt,
      attachment: false
    });
  } catch {
    return asset.url || filePath;
  }
}

module.exports = {
  getCloudinaryAssetDescriptor,
  getFetchableUrl
};

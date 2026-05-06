const { Readable } = require('stream');
const { getCloudinaryAssetDescriptor, getFetchableUrl } = require('./cloudinaryAsset');

function getDocumentKind(filePath) {
  const descriptor = getCloudinaryAssetDescriptor(filePath);
  const extensionSource = descriptor?.format ? `.${descriptor.format}` : filePath;

  if (/\.pdf(?:$|\?)/i.test(extensionSource)) return 'pdf';
  if (/\.(png|jpe?g|webp|gif|bmp|svg)(?:$|\?)/i.test(extensionSource)) return 'image';
  return 'file';
}

function getDocumentKindFromContentType(contentType) {
  const normalized = (contentType || '').toLowerCase();

  if (normalized.includes('application/pdf')) return 'pdf';
  if (normalized.startsWith('image/')) return 'image';
  return null;
}

async function fetchRemoteHeaders(filePath) {
  const fetchUrl = getFetchableUrl(filePath);

  try {
    const response = await fetch(fetchUrl, { method: 'HEAD' });
    if (response.ok) {
      return response.headers;
    }
  } catch {
  }

  try {
    const response = await fetch(fetchUrl);
    if (response.ok) {
      const headers = response.headers;
      response.body?.cancel?.();
      return headers;
    }
  } catch {
    return null;
  }

  return null;
}

async function resolveDocumentKind(filePath) {
  const headers = await fetchRemoteHeaders(filePath);
  const fromHeaders = getDocumentKindFromContentType(headers?.get('content-type'));

  return fromHeaders || getDocumentKind(filePath);
}

function getDownloadFilename(contentType, fallbackKind) {
  const normalized = (contentType || '').toLowerCase();

  if (normalized.includes('application/pdf') || fallbackKind === 'pdf') return 'shared-document.pdf';
  if (normalized.includes('image/jpeg')) return 'shared-document.jpg';
  if (normalized.includes('image/png')) return 'shared-document.png';
  if (normalized.includes('image/webp')) return 'shared-document.webp';
  if (normalized.includes('image/gif')) return 'shared-document.gif';
  if (normalized.includes('image/bmp')) return 'shared-document.bmp';
  if (normalized.includes('image/svg+xml')) return 'shared-document.svg';

  return 'shared-document.bin';
}

function forwardUpstreamHeaders(upstream, res, kind) {
  const headerNames = ['content-type', 'content-length', 'content-range', 'accept-ranges', 'cache-control', 'etag', 'last-modified'];

  for (const name of headerNames) {
    const value = upstream.headers.get(name);
    if (value) {
      res.setHeader(name, value);
    }
  }

  if (!upstream.headers.get('accept-ranges') && kind === 'pdf') {
    res.setHeader('Accept-Ranges', 'bytes');
  }
}

async function pipeRemoteDocument(req, res, filePath, options = {}) {
  const requestHeaders = {};
  const rangeHeader = req.headers.range;
  const fetchUrl = getFetchableUrl(filePath);

  if (rangeHeader) {
    requestHeaders.Range = rangeHeader;
  }

  const upstream = await fetch(fetchUrl, {
    headers: requestHeaders
  });

  if (!upstream.ok || !upstream.body) {
    return {
      ok: false,
      status: upstream.status || 502
    };
  }

  const kind = getDocumentKind(filePath);
  const contentType = upstream.headers.get('content-type') || 'application/octet-stream';
  const dispositionType = options.disposition === 'attachment' ? 'attachment' : 'inline';

  res.status(upstream.status);
  forwardUpstreamHeaders(upstream, res, kind);
  res.setHeader('Content-Type', contentType);

  if (dispositionType === 'attachment') {
    const fileName = options.fileName || getDownloadFilename(contentType, kind);
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
  } else {
    res.setHeader('Content-Disposition', 'inline');
  }

  Readable.fromWeb(upstream.body).pipe(res);

  return {
    ok: true,
    contentType
  };
}

module.exports = {
  getDocumentKind,
  getDownloadFilename,
  pipeRemoteDocument,
  resolveDocumentKind
};

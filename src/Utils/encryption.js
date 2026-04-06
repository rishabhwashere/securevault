const crypto = require('crypto');

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;
const KEY = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');
const HEX_PATTERN = /^[0-9a-f]+$/i;

function isEncryptedPayload(payload) {
  if (typeof payload !== 'string') {
    return false;
  }

  const parts = payload.split(':');
  if (parts.length !== 3) {
    return false;
  }

  const [iv, authTag, encryptedData] = parts;

  return (
    iv.length === IV_LENGTH * 2 &&
    authTag.length === 32 &&
    encryptedData.length > 0 &&
    encryptedData.length % 2 === 0 &&
    HEX_PATTERN.test(iv) &&
    HEX_PATTERN.test(authTag) &&
    HEX_PATTERN.test(encryptedData)
  );
}

function encrypt(text) {
  if (text === undefined || text === null) {
    return text;
  }

  if (isEncryptedPayload(text)) {
    return text;
  }

  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);

  const encrypted = Buffer.concat([
    cipher.update(String(text), 'utf8'),
    cipher.final()
  ]);

  return [
    iv.toString('hex'),
    cipher.getAuthTag().toString('hex'),
    encrypted.toString('hex')
  ].join(':');
}

function decrypt(payload) {
  if (!isEncryptedPayload(payload)) {
    return payload;
  }

  const [iv, authTag, encryptedData] = payload.split(':');

  try {
    const decipher = crypto.createDecipheriv(
      ALGORITHM,
      KEY,
      Buffer.from(iv, 'hex')
    );

    decipher.setAuthTag(Buffer.from(authTag, 'hex'));

    return Buffer.concat([
      decipher.update(Buffer.from(encryptedData, 'hex')),
      decipher.final()
    ]).toString('utf8');
  } catch (error) {
    if (error.message === 'Invalid initialization vector') {
      return payload;
    }

    throw error;
  }
}

module.exports = {
  encrypt,
  decrypt,
  isEncryptedPayload
};

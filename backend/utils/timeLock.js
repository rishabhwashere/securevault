function normalizeUnlockAt(value) {
  if (value === undefined) {
    return undefined;
  }

  if (value === null || value === '') {
    return null;
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return undefined;
  }

  return parsed;
}

function isVaultLocked(vaultEntry) {
  if (!vaultEntry?.unlockAt) {
    return false;
  }

  return new Date(vaultEntry.unlockAt).getTime() > Date.now();
}

function formatUnlockAt(unlockAt) {
  if (!unlockAt) {
    return 'an unknown time';
  }

  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(unlockAt));
}

function getVaultLockMessage(vaultEntry) {
  return `Document is locked until ${formatUnlockAt(vaultEntry?.unlockAt)}`;
}

module.exports = {
  normalizeUnlockAt,
  isVaultLocked,
  getVaultLockMessage
};

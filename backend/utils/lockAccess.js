const ActivityLog = require('../models/activitylog');
const { encrypt } = require('./encryption');
const { getVaultLockMessage, isVaultLocked } = require('./timeLock');

async function enforceVaultUnlock(req, res, vaultEntry, action = 'view') {
  if (!isVaultLocked(vaultEntry)) {
    return false;
  }

  await ActivityLog.create({
    user: req.user?._id || vaultEntry.owner,
    action: 'VAULT_LOCKED_ACCESS_ATTEMPT',
    vault: vaultEntry._id,
    metadata: {
      attemptedAction: action,
      title: encrypt(vaultEntry.title),
      unlockAt: vaultEntry.unlockAt
    }
  }).catch(() => null);

  res.status(403).json({
    success: false,
    message: getVaultLockMessage(vaultEntry)
  });

  return true;
}

module.exports = {
  enforceVaultUnlock
};

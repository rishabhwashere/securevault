const validateVaultInput = (req, res, next) => {
    const { title, unlockAt, requiresDualApproval, secondApproverEmail } = req.body;

    if (!title || typeof title !== 'string') {
        return res.status(400).json({ success: false, message: 'Valid title is required' });
    }

    if (unlockAt !== undefined && unlockAt !== null && unlockAt !== '') {
        const parsedUnlockAt = new Date(unlockAt);

        if (Number.isNaN(parsedUnlockAt.getTime())) {
            return res.status(400).json({ success: false, message: 'unlockAt must be a valid date/time' });
        }
    }

    const dualApprovalEnabled = requiresDualApproval === true || requiresDualApproval === 'true';
    if (dualApprovalEnabled && (!secondApproverEmail || typeof secondApproverEmail !== 'string')) {
        return res.status(400).json({ success: false, message: 'Second approver email is required when dual approval is enabled' });
    }

    next();
};

module.exports = validateVaultInput;

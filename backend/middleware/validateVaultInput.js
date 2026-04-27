const validateVaultInput = (req, res, next) => {
    const { title, data, notes, unlockAt } = req.body;

    if (!title || typeof title !== 'string') {
        return res.status(400).json({ success: false, message: 'Valid title is required' });
    }

    if ((!data || typeof data !== 'string') && (!notes || typeof notes !== 'string')) {
        return res.status(400).json({ success: false, message: 'Valid notes or data are required' });
    }

    if (unlockAt !== undefined && unlockAt !== null && unlockAt !== '') {
        const parsedUnlockAt = new Date(unlockAt);

        if (Number.isNaN(parsedUnlockAt.getTime())) {
            return res.status(400).json({ success: false, message: 'unlockAt must be a valid date/time' });
        }
    }

    next();
};

module.exports = validateVaultInput;

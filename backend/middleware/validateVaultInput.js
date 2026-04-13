const validateVaultInput = (req, res, next) => {
    const { title, data, notes } = req.body;

    if (!title || typeof title !== 'string') {
        return res.status(400).json({ success: false, message: 'Valid title is required' });
    }

    if ((!data || typeof data !== 'string') && (!notes || typeof notes !== 'string')) {
        return res.status(400).json({ success: false, message: 'Valid notes or data are required' });
    }

    next();
};

module.exports = validateVaultInput;

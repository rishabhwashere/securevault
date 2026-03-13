const validateVaultInput = (req, res, next) => {
    const { title, data } = req.body;

    if (!title || typeof title !== 'string') {
        return res.status(400).json({ success: false, message: 'Valid title is required' });
    }

    if (!data || typeof data !== 'string') {
        return res.status(400).json({ success: false, message: 'Valid data is required' });
    }

    next();
};

module.exports = validateVaultInput;
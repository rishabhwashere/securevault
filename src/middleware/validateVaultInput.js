const validateVaultInput = (req, res, next) => {
    const { title, data } = req.body;

    if (!title || typeof title !== 'string') {
        return res.status(400).json({ success: false, message: 'Valid title is required' });
    }

    if (!data || typeof data !== 'string') {
        return res.status(400).json({ success: false, message: 'Valid data is required' });
    }

    // We removed the 'owner' check here because authMiddleware handles it now!

    next();
};

module.exports = validateVaultInput;
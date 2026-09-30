export default (req, res, next) => {
    const id = Number(req.header('x-user-id'));
    if (!id) return res.status(401).json({ error: 'Not authorized' });
    req.user = { id, role: req.header('x-user-role') || 'user' };
    next();
};
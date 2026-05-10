import jwt from 'jsonwebtoken'

export const signToken = (userId) =>
    jwt.sign({ sub: userId }, process.env.JWT_SECRET, { expiresIn: '7d' })

export const requiresAuth = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]
    console.log('token recieved:', token)
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' })
    }
    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET)
        next()
    } catch (err) {
        console.log('jwt error:', err.message)
        res.status(401).json({ error: 'Invalid token' })
    }
}
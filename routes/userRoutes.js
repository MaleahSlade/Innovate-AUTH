import express from 'express';
import User from '../models/User.js';
const router = express.Router();
// POST /api/users/register
router.post('/register', async (req, res) => {
try {
const { username, email, password } = req.body;
if (!username || !email || !password) {
return res.status(400).json({ message: 'Username, email, and password are required.' });
}
const existingUser = await User.findOne({ email });
if (existingUser) {
return res.status(400).json({ message: 'A user with that email already exists.' });
}
const user = new User({ username, email, password });
await user.save(); // pre-save hook hashes the password here
const userData = user.toObject();
delete userData.password; // never send the password back
res.status(201).json(userData);
} catch (err) {
res.status(500).json({ message: 'Something went wrong.', error: err.message });
}
});
export default router;
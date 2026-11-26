import express from 'express';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';


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

// POST /api/users/login
router.post('/login', async (req, res) => {
try {
const { email, password } = req.body;
const user = await User.findOne({ email });
if (!user) {
return res.status(400).json({ message: 'Incorrect email or password.' });
}
const correctPw = await user.isCorrectPassword(password);
if (!correctPw) {
return res.status(400).json({ message: 'Incorrect email or password.' });
}
const token = jwt.sign(
{ _id: user._id, username: user.username },
process.env.JWT_SECRET,
{ expiresIn: '2h' }
);
const userData = user.toObject();
delete userData.password;
res.json({ token, user: userData });
} catch (err) {
res.status(500).json({ message: 'Something went wrong.', error: err.message });
}
});

export default router;
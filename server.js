import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import userRoutes from './routes/userRoutes.js';
const app = express();
const PORT = process.env.PORT || 3001;
app.use(express.json());
app.use('/api/users', userRoutes);
mongoose
.connect(process.env.MONGO_URI)
.then(() => {
console.log('Connected to Maleah\'s MongoDB');
app.listen(PORT, () => console.log(`Maleah\'s Server running on port ${PORT}`));
})
.catch((err) => {
console.error('MongoDB connection error:', err.message);
process.exit(1);
});
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

app.use(express.json());

const profileRoutes = require('./routes/profile');
app.use('/api/profile', profileRoutes);

const PORT = process.env.BACKEND_PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

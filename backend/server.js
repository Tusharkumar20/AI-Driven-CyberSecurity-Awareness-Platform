const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

app.use(express.json());

const profileRoutes = require('./routes/profile');
app.use('/api/profile', profileRoutes);

app.listen(3000, () => console.log('Server running'));
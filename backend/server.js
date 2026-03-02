const express = require('express');
const app = express();
app.use(express.json());

const profileRoutes = require('./routes/profile');
app.use('/api/profile', profileRoutes);

app.listen(3000, () => console.log('Server running'));
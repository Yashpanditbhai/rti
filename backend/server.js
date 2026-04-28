const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

require('dotenv').config();

const connectDB = require('./config/db');
const rtiRoutes = require('./routes/rtiRoutes');
const authRoutes = require('./routes/authRoutes');
const errorHandler = require('./middleware/errorHandler');
const User = require('./models/User');
const RTI = require('./models/RTI');

connectDB().then(async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      await User.create({ name: 'Admin User', email: 'admin@rti.com', password: 'admin123', role: 'admin' });
      console.log('Admin user seeded');
    }
    const rtiCount = await RTI.countDocuments();
    if (rtiCount === 0) {
      const { seedData } = require('./seeds/data');
      await RTI.insertMany(seedData);
      console.log(`${seedData.length} RTI records seeded`);
    }
  } catch (err) {
    console.error('Auto-seed error:', err.message);
  }
});

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'RTI Management System API',
      version: '1.0.0',
      description: 'API documentation for the RTI Management System',
    },
    servers: [{ url: '/', description: 'Current server' }],
  },
  apis: ['./routes/*.js'],
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/auth', authRoutes);
app.use('/api/rti', rtiRoutes);

app.use(errorHandler);

if (process.env.NODE_ENV === 'production') {
  const frontendPath = path.join(__dirname, '..', 'frontend', 'dist');
  app.use(express.static(frontendPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
}

const PORT = process.env.PORT || 6000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';
import { v2 as cloudinary } from 'cloudinary';

// Load environment variables
dotenv.config();

export const sequelize = new Sequelize(process.env.DATABASE_URL!, {
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Import models after sequelize is initialized
import './models/Reservation';
import './models/Admin';
import './models/Media';

// Import routes after models are initialized
import reservationRoutes from './routes/reservations';
import uploadRoutes from './routes/uploads';
import adminRoutes from './routes/admin';
import mediaRoutes from './routes/media';

// Try to sync database (failures won't crash the server; useful in dev when DATABASE_URL is not set)
(async () => {
  try {
    await sequelize.sync();
    console.log('✅ Database synced');
    
    // Seed admin user
    const { seedAdmin } = await import('./utils/seed');
    await seedAdmin();
  } catch (err) {
    console.error('Failed to sync database (continuing without DB):', err);
  }
})();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Boost Studio API is running' });
});

// Health endpoint for monitoring (UptimeRobot)
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/reservations', reservationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/media', mediaRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route not found' 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Boost Studio API server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
});
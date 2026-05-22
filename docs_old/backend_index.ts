import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    message: '✅ Property Management ERP Backend is running!',
  });
});

// Welcome endpoint
app.get('/api', (req, res) => {
  res.json({
    message: 'Welcome to Property Management ERP API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/auth/*',
      schemes: '/api/schemes/*',
      properties: '/api/properties/*',
      lottery: '/api/lottery/*',
      auction: '/api/auction/*',
      fcfs: '/api/fcfs/*',
      directAllotment: '/api/direct-allotment/*',
      rbac: '/api/admin/*',
    },
  });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'An error occurred',
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n${'='.repeat(50)}`);
  console.log(`✅ Property Management ERP Backend`);
  console.log(`✅ Server running at http://localhost:${PORT}`);
  console.log(`✅ Environment: ${process.env.NODE_ENV}`);
  console.log(`✅ API Base: http://localhost:${PORT}/api`);
  console.log(`${'='.repeat(50)}\n`);
  console.log('Available endpoints:');
  console.log(`  • GET  http://localhost:${PORT}/health`);
  console.log(`  • GET  http://localhost:${PORT}/api`);
  console.log(`  • POST http://localhost:${PORT}/api/auth/login`);
  console.log(`  • POST http://localhost:${PORT}/api/auth/register`);
  console.log(`\nReady to handle requests! 🚀\n`);
});

export default app;

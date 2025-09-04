const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const app = express();
const prisma = new PrismaClient();

// Configure CORS
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://competing-leaders.vercel.app',
    'https://*.vercel.app'
  ],
  credentials: true
}));

app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({ 
    status: 'Server is running!', 
    message: 'Competing Leaders Backend',
    timestamp: new Date().toISOString()
  });
});

// Test database connection - ADD THIS ENDPOINT!
app.get('/api/test-db', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'Database connected successfully!' });
  } catch (error) {
    res.status(500).json({ 
      status: 'Database connection failed',
      error: error.message 
    });
  }
});

// Start a new game
app.post('/api/game/start', async (req, res) => {
  try {
    const { userId = 'anonymous-' + Date.now() } = req.body;
    
    // For now, return mock data to test
    const mockGame = {
      id: 'game-' + Date.now(),
      userId: userId,
      state: {
        stability: 75,
        tech: 55,
        economic: 70,
        environment: 45,
        social: 60,
        military: 40
      },
      decisions: [],
      currentScene: 1,
      createdAt: new Date().toISOString()
    };
    
    res.json(mockGame);
    
  } catch (error) {
    console.error('Error starting game:', error);
    res.status(500).json({ 
      error: 'Failed to start game',
      message: error.message 
    });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Database URL exists: ${!!process.env.DATABASE_URL}`);
});
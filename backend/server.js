const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Simple CORS - allow all for now
app.use(cors());
app.use(express.json());

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    status: 'Server is running!', 
    message: 'Competing Leaders Backend',
    timestamp: new Date().toISOString()
  });
});

// Game start endpoint
app.post('/api/game/start', (req, res) => {
  const { userId = 'anonymous' } = req.body;
  
  const gameData = {
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
  
  console.log('Game started for user:', userId);
  res.json(gameData);
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Server error' });
});

const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  server.close(() => {
    console.log('Server closed');
  });
});
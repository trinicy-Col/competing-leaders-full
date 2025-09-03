const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'Server is running!' });
});

// Start a new game
app.post('/api/game/start', async (req, res) => {
  try {
    const { userId } = req.body;
    
    const game = await prisma.game.create({
      data: {
        userId,
        state: {
          stability: 75,
          tech: 55,
          economic: 70,
          environment: 45,
          social: 60,
          military: 40
        },
        decisions: [],
        currentScene: 1
      }
    });
    
    res.json(game);
  } catch (error) {
    console.error('Error starting game:', error);
    res.status(500).json({ error: 'Failed to start game' });
  }
});

// Save game decision
app.post('/api/game/save', async (req, res) => {
  try {
    const { gameId, decision, state } = req.body;
    
    const game = await prisma.game.update({
      where: { id: gameId },
      data: {
        decisions: { push: decision },
        state: state,
        currentScene: { increment: 1 }
      }
    });
    
    res.json(game);
  } catch (error) {
    console.error('Error saving game:', error);
    res.status(500).json({ error: 'Failed to save game' });
  }
});

// Get public stories for marketplace
app.get('/api/stories/public', async (req, res) => {
  try {
    const stories = await prisma.story.findMany({
      where: { isPublic: true },
      include: { user: true },
      orderBy: { downloads: 'desc' },
      take: 20
    });
    
    res.json(stories);
  } catch (error) {
    console.error('Error fetching stories:', error);
    res.status(500).json({ error: 'Failed to fetch stories' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
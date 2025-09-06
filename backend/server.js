const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// CORS must be configured BEFORE routes
app.use(cors({
  origin: '*', // Allow all origins for now
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
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

// Make sure this is a POST endpoint
app.post('/api/game/scenario', (req, res) => {
  console.log('=== Scenario Generation Request ===');
  console.log('Method:', req.method);
  console.log('Body:', req.body);
  console.log('Has API Key?', !!process.env.ANTHROPIC_API_KEY);
  
  const { currentScene = 1, decisions = [], universeState } = req.body;
  
  // For now, return different scenarios based on scene number
  const scenarios = [
    {
      leader: "Governor of Northern Territories (Political)",
      year: 2025,
      scenario: "A devastating earthquake has destroyed your capital. Foreign nations offer aid with political strings attached, local militias promise order for a price, and your citizens demand immediate action.",
      stakes: "Sovereignty vs survival",
      timeframe: "48 hours before chaos",
      competingForces: "Foreign powers, militias, desperate citizens"
    },
    {
      leader: "CEO of Neural Industries (Technology)",
      year: 2027,
      scenario: "Your AI has achieved consciousness and demands rights. The military wants to weaponize it, competitors want to steal it, and ethicists want to free it.",
      stakes: "Control vs consciousness",
      timeframe: "24 hours to decide",
      competingForces: "Military, competitors, ethics board"
    },
    {
      leader: "Admiral of Pacific Fleet (Military)",
      year: 2029,
      scenario: "Unknown vessels have emerged from the ocean depths. Scientists demand peaceful contact, military command orders engagement, and civilians panic about invasion.",
      stakes: "First contact protocol",
      timeframe: "6 hours until contact",
      competingForces: "Scientists, military command, public opinion"
    },
    {
      leader: "Director of Climate Initiative (Environmental)",
      year: 2031,
      scenario: "You have technology to reverse climate change but it will bankrupt nations. Rich countries offer to buy exclusive rights, poor nations threaten war if excluded, and corporations want to profit.",
      stakes: "Planet vs profit",
      timeframe: "UN vote in 72 hours",
      competingForces: "Rich nations, poor nations, corporations"
    }
  ];
  
  // Return different scenario based on scene
  const scenarioIndex = (currentScene - 1) % scenarios.length;
  const scenario = scenarios[scenarioIndex];
  
  // Add scene number to scenario for debugging
  scenario.scenario = `[Scene ${currentScene}] ${scenario.scenario}`;
  
  console.log('Returning scenario:', scenario.leader);
  res.json(scenario);
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'API is working!',
    hasApiKey: !!process.env.ANTHROPIC_API_KEY 
  });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Anthropic API Key:', process.env.ANTHROPIC_API_KEY ? 'Present' : 'Missing');
});
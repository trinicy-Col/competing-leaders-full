const express = require('express');
const cors = require('cors');

const app = express();

// Enable CORS for all origins
app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({
    status: 'Server is running!',
    message: 'Competing Leaders Backend',
    timestamp: new Date().toISOString()
  });
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'API is working!',
    timestamp: new Date().toISOString()
  });
});

// Scenario generation endpoint - SIMPLE VERSION
app.post('/api/game/scenario', (req, res) => {
  try {
    const { currentScene = 1 } = req.body;
    
    // Array of different scenarios
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
        scenario: "You have technology to reverse climate change but it will bankrupt nations. Rich countries offer to buy exclusive rights, poor nations threaten war if excluded.",
        stakes: "Planet vs profit",
        timeframe: "UN vote in 72 hours",
        competingForces: "Rich nations, poor nations, corporations"
      },
      {
        leader: "Chief of Mars Colony (Colonial)",
        year: 2033,
        scenario: "Earth has cut off supplies demanding your resources. You can declare independence and risk war, negotiate and lose autonomy, or find underground allies.",
        stakes: "Freedom vs survival",
        timeframe: "Oxygen runs out in 96 hours",
        competingForces: "Earth government, colonist rebels, black market"
      },
      {
        leader: "Head of Religious Council (Spiritual)",
        year: 2035,
        scenario: "An AI claims to be divine and has millions of followers. Traditional religions demand its destruction, tech companies want to study it, and believers call it salvation.",
        stakes: "Faith vs technology",
        timeframe: "Global summit in 48 hours",
        competingForces: "Traditional religions, tech companies, AI followers"
      }
    ];
    
    // Select scenario based on scene number
    const index = (currentScene - 1) % scenarios.length;
    const scenario = scenarios[index];
    
    // Add scene info to help debug
    console.log(`Returning scenario ${index + 1} for scene ${currentScene}`);
    
    res.json(scenario);
  } catch (error) {
    console.error('Error in /api/game/scenario:', error);
    res.status(500).json({ 
      error: 'Failed to generate scenario',
      message: error.message 
    });
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
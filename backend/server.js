const express = require('express');
const cors = require('cors');
require('dotenv').config();

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
  res.json({ message: 'API is working!' });
});

// Scenario generation endpoint
app.post('/api/game/scenario', async (req, res) => {
  console.log('Scenario request received');
  
  try {
    const { currentScene, decisions, universeState } = req.body;
    
    // For now, return a simple generated scenario without Claude API
    // This ensures your backend works first
    const scenarios = [
      {
        leader: "Governor of Coastal Territories (Political/Regional)",
        year: 2025 + currentScene,
        scenario: `Scene ${currentScene}: A massive hurricane has devastated your region. Federal aid is available but comes with strict oversight that would limit your autonomy. Private corporations offer faster help but want long-term contracts for resource extraction.`,
        stakes: "Regional autonomy vs immediate aid",
        timeframe: "72 hours before crisis deepens",
        competingForces: "Federal government, corporate interests, local activists"
      },
      {
        leader: "CEO of BioGen Industries (Corporate/Scientific)",
        year: 2026 + currentScene,
        scenario: `Scene ${currentScene}: Your company has developed a cure for a rare disease affecting millions. The government wants to nationalize it, activists demand free distribution, while shareholders insist on profit maximization.`,
        stakes: "Profit vs public health",
        timeframe: "Board meeting in 24 hours",
        competingForces: "Government regulators, shareholder board, patient advocates"
      },
      {
        leader: "Commander of Peacekeeping Forces (Military/International)",
        year: 2027 + currentScene,
        scenario: `Scene ${currentScene}: A disputed border region is erupting in conflict. You can enforce a ceasefire through force, negotiate with local warlords, or withdraw and let the UN handle it.`,
        stakes: "Peace through force vs diplomacy",
        timeframe: "6 hours before violence escalates",
        competingForces: "Local militias, UN command, civilian population"
      }
    ];
    
    // Pick a scenario based on scene number
    const scenarioIndex = (currentScene - 1) % scenarios.length;
    const scenario = scenarios[scenarioIndex];
    
    // Add some variation based on previous decisions
    if (decisions && decisions.length > 0) {
      scenario.scenario = `Following your previous decision: "${decisions[decisions.length - 1].decision.substring(0, 50)}..." - ${scenario.scenario}`;
    }
    
    res.json(scenario);
    
  } catch (error) {
    console.error('Error in scenario generation:', error);
    res.status(500).json({ 
      error: 'Failed to generate scenario',
      message: error.message 
    });
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    status: 'Server is running!', 
    message: 'Competing Leaders Backend'
  });
});

// Generate scenario using Claude
app.post('/api/game/scenario', async (req, res) => {
  try {
    const { currentScene, previousDecision, universeState, decisions } = req.body;
    
    // Build context from previous decisions
    const context = decisions.map(d => 
      `Scene ${d.scene}: As ${d.leader} in year ${d.year}, player decided: "${d.decision}"`
    ).join('\n');
    
    const prompt = `You are the Game Master for "Competing Leaders". Generate scene ${currentScene} of 12.

${context ? `Previous decisions:\n${context}\n` : 'This is the first scenario.'}

Current Universe State:
- Stability: ${universeState.stability}%
- Tech Level: ${universeState.tech}%
- Economic Power: ${universeState.economic}%
- Environmental Health: ${universeState.environment}%
- Social Cohesion: ${universeState.social}%
- Military Tension: ${universeState.military}%

Create a scenario where a NEW type of leader emerges to deal with the consequences of previous decisions. Include realistic ripple effects and unintended consequences.

Return ONLY a JSON object with this exact structure:
{
  "leader": "Title of Leader (Category/Type)",
  "year": ${decisions.length > 0 ? decisions[decisions.length - 1].year + Math.floor(Math.random() * 5) + 1 : 2027},
  "scenario": "Detailed scenario text",
  "stakes": "What's at risk",
  "timeframe": "Urgency of decision",
  "competingForces": "Who wants what",
  "stateChanges": {
    "stability": -10 to +10,
    "tech": -10 to +10,
    "economic": -10 to +10,
    "environment": -10 to +10,
    "social": -10 to +10,
    "military": -10 to +10
  }
}`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',  // Fast and cheap model
        max_tokens: 1000,
        messages: [{
          role: 'user',
          content: prompt
        }]
      })
    });

    const data = await response.json();
    const scenarioText = data.content[0].text;
    const scenario = JSON.parse(scenarioText);
    
    res.json(scenario);
    
  } catch (error) {
    console.error('Error generating scenario:', error);
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
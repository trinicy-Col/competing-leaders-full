const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Enable CORS for all origins during development
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

// Generate unique scenario using Claude API
app.post('/api/game/scenario', async (req, res) => {
  try {
    const { currentScene, previousDecision, universeState, decisions } = req.body;
    
    // Build context from all previous decisions
    let context = "";
    if (decisions && decisions.length > 0) {
      context = "Previous decisions in this game:\n";
      decisions.forEach(d => {
        context += `Scene ${d.scene}: As ${d.leader} in year ${d.year}, player decided: "${d.decision}"\n`;
      });
    }

    const prompt = `You are the Game Master for "Competing Leaders", a game where players take on different leadership roles throughout history and the future.

${currentScene === 1 ? 'Create a COMPLETELY UNIQUE opening scenario. Be creative and original.' : `This is scene ${currentScene} of 12.

${context}

Current Universe State:
- Stability: ${universeState.stability}%
- Tech Level: ${universeState.tech}%  
- Economic Power: ${universeState.economic}%
- Environmental Health: ${universeState.environment}%
- Social Cohesion: ${universeState.social}%
- Military Tension: ${universeState.military}%

Based on the previous decisions and their consequences, create the next scenario where a NEW type of leader emerges to deal with the ripple effects. Show realistic unintended consequences.`}

Requirements:
- Use fictional names for all people, companies, and organizations
- Create compelling moral dilemmas with no clear right answer
- Include realistic competing forces and time pressure
- Year should progress realistically (1-5 years forward each scene)
- The scenario must be unique and not repeat common tropes

Return ONLY a valid JSON object with this exact structure:
{
  "leader": "Title of Leader (Category/Type)",
  "year": ${currentScene === 1 ? '2025 + random 0-10' : 'previous year + 1-5'},
  "scenario": "Detailed 3-4 sentence scenario describing the crisis and decision needed",
  "stakes": "What's at risk in 10 words or less",
  "timeframe": "Urgency of decision in specific time units",
  "competingForces": "Three different groups wanting different outcomes",
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
        model: 'claude-3-haiku-20240307',
        max_tokens: 1000,
        temperature: 0.9, // Higher temperature for more creativity
        messages: [{
          role: 'user',
          content: prompt
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`Claude API error: ${response.status}`);
    }

    const data = await response.json();
    const scenarioText = data.content[0].text;
    
    // Parse JSON from Claude's response
    const scenario = JSON.parse(scenarioText);
    
    res.json(scenario);

  } catch (error) {
    console.error('Error generating scenario:', error);
    
    // Fallback to a basic generated scenario if API fails
    const fallbackScenario = {
      leader: `Emergency Council Leader (Crisis Management)`,
      year: 2025 + Math.floor(Math.random() * 5),
      scenario: "An unprecedented crisis requires immediate leadership. Multiple factions are vying for control while critical infrastructure fails. Your decision will determine the path forward for millions.",
      stakes: "Civilization's survival",
      timeframe: "24 hours to act",
      competingForces: "Military hardliners, civilian government, corporate interests",
      stateChanges: {
        stability: -5,
        tech: 0,
        economic: -5,
        environment: 0,
        social: -5,
        military: 5
      }
    };
    
    res.json(fallbackScenario);
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', function(req, res) {
  res.json({ status: 'Running' });
});

app.post('/api/game/scenario', function(req, res) {
  const num = req.body.currentScene || 1;
  res.json({
    leader: 'Leader ' + num,
    year: 2025 + num,
    scenario: 'Scenario ' + num,
    stakes: 'Stakes',
    timeframe: 'Time',
    competingForces: 'Forces'
  });
});

app.listen(process.env.PORT || 3001);
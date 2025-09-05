'use client';

import { useState } from 'react';

export default function GameBoard() {
  const [gameState, setGameState] = useState({
    currentScene: 0,
    maxScenes: 12,
    currentYear: 2027,
    decisions: [],
    universeState: {
      stability: 75,
      tech: 55,
      economic: 70,
      environment: 45,
      social: 60,
      military: 40
    }
  });

  const [loading, setLoading] = useState(false);
  const [scenario, setScenario] = useState<any>(null);

  const startGame = async () => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/game/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'test-user' })
      });
      const data = await response.json();
      console.log('Game started:', data);
      // Set initial game state
    } catch (error) {
      console.error('Error starting game:', error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
        Competing Leaders
      </h1>
      <button 
        onClick={startGame}
        className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg transition-all duration-200 hover:scale-105"
        disabled={loading}
      >
        {loading ? 'Starting...' : 'Start New Game'}
      </button>
      {loading && <p className="mt-4">Loading game...</p>}
      {scenario && (
        <div className="mt-8 p-6 bg-slate-800 rounded-lg">
          <pre>{JSON.stringify(scenario, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
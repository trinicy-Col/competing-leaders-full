'use client';

import { useState } from 'react';

// Type definitions
interface UniverseState {
  stability: number;
  tech: number;
  economic: number;
  environment: number;
  social: number;
  military: number;
}

interface Decision {
  scene: number;
  leader: string;
  year: number;
  decision: string;
}

interface GameState {
  id?: string;
  currentScene: number;
  maxScenes: number;
  currentYear: number;
  decisions: Decision[];
  universeState: UniverseState;
}

interface Scenario {
  leader: string;
  year: number;
  scenario: string;
  stakes: string;
  timeframe: string;
  competingForces: string;
  consequences?: string;
  stateChanges?: {
    stability: number;
    tech: number;
    economic: number;
    environment: number;
    social: number;
    military: number;
  };
}

export default function Home() {
  const [gameState, setGameState] = useState<GameState>({
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

  const [loading, setLoading] = useState<boolean>(false);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [currentScenario, setCurrentScenario] = useState<Scenario | null>(null);
  const [decision, setDecision] = useState<string>('');

  const startGame = () => {
    setGameStarted(true);
    setGameState(prev => ({
      ...prev,
      id: 'game-' + Date.now(),
      currentScene: 1
    }));
    generateScenario();
  };

  const generateScenario = async () => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/game/scenario`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentScene: gameState.currentScene,
          previousDecision: gameState.decisions[gameState.decisions.length - 1] || null,
          universeState: gameState.universeState,
          decisions: gameState.decisions
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate scenario');
      }
      
      const scenario = await response.json();
      
      setCurrentScenario(scenario);
      
      // Update universe state with changes from the scenario
      if (scenario.stateChanges) {
        setGameState(prev => ({
          ...prev,
          currentYear: scenario.year,
          universeState: {
            stability: Math.max(0, Math.min(100, prev.universeState.stability + (scenario.stateChanges?.stability || 0))),
            tech: Math.max(0, Math.min(100, prev.universeState.tech + (scenario.stateChanges?.tech || 0))),
            economic: Math.max(0, Math.min(100, prev.universeState.economic + (scenario.stateChanges?.economic || 0))),
            environment: Math.max(0, Math.min(100, prev.universeState.environment + (scenario.stateChanges?.environment || 0))),
            social: Math.max(0, Math.min(100, prev.universeState.social + (scenario.stateChanges?.social || 0))),
            military: Math.max(0, Math.min(100, prev.universeState.military + (scenario.stateChanges?.military || 0)))
          }
        }));
      } else {
        setGameState(prev => ({
          ...prev,
          currentYear: scenario.year
        }));
      }
      
    } catch (error) {
      console.error('Error generating scenario:', error);
      // Fallback scenario if API fails
      const fallbackScenario: Scenario = {
        leader: "CEO of Nexus Communications (Corporate/Technological)",
        year: 2027,
        scenario: "A massive solar storm has knocked out 40% of global internet infrastructure. Governments are panicking, economies are crashing, and rival tech companies are trying to capitalize on the chaos. Your company has the technology to restore communications within 72 hours, but it would require redirecting resources from your secret military contracts and revealing proprietary technology to competitors.",
        stakes: "Control over global communications infrastructure vs company secrets",
        timeframe: "72 hours before complete infrastructure collapse",
        competingForces: "Government agencies demanding access, rival corporations, military contractors"
      };
      setCurrentScenario(fallbackScenario);
      setGameState(prev => ({
        ...prev,
        currentYear: fallbackScenario.year
      }));
    }
    setLoading(false);
  };

  const submitDecision = async () => {
    if (!decision.trim()) {
      alert('Please enter your decision');
      return;
    }

    setLoading(true);
    
    if (currentScenario) {
      setGameState(prev => ({
        ...prev,
        decisions: [...prev.decisions, {
          scene: prev.currentScene,
          leader: currentScenario.leader,
          year: currentScenario.year,
          decision: decision
        }],
        currentScene: prev.currentScene + 1
      }));
    }

    setDecision('');

    if (gameState.currentScene >= gameState.maxScenes) {
      alert('Game Complete! Your story has been written.');
      setLoading(false);
    } else {
      // Generate the next scenario after updating state
      setTimeout(() => {
        generateScenario();
      }, 100);
    }
  };

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white p-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            Competing Leaders
          </h1>
          <p className="text-xl mb-8 text-gray-300">
            Experience humanity's journey through time by taking on different powerful roles across history and the future.
          </p>
          <button 
            onClick={startGame}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-8 py-4 rounded-lg text-xl font-semibold transition-all duration-200 hover:scale-105"
            disabled={loading}
          >
            {loading ? 'Starting...' : 'Begin Your Journey'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="flex">
        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
              Competing Leaders
            </h1>
            
            <div className="mb-4 text-sm text-gray-400">
              Scene {gameState.currentScene} of {gameState.maxScenes} | Year: {gameState.currentYear}
            </div>

            {loading ? (
              <div className="bg-slate-800 p-8 rounded-lg text-center">
                <p className="text-xl text-purple-400">Generating scenario...</p>
                <p className="text-sm text-gray-400 mt-2">The AI Game Master is creating your next challenge</p>
              </div>
            ) : currentScenario && (
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-blue-900 to-purple-900 p-4 rounded-lg">
                  <h2 className="text-xl font-bold">{currentScenario.leader}</h2>
                </div>

                <div className="bg-slate-800 p-6 rounded-lg">
                  <p className="text-lg leading-relaxed">{currentScenario.scenario}</p>
                </div>

                <div className="bg-purple-900/30 border-l-4 border-purple-500 p-4">
                  <div className="text-sm text-purple-300 font-semibold mb-2">STAKES:</div>
                  <p>{currentScenario.stakes}</p>
                </div>

                <div className="bg-red-900/30 border-l-4 border-red-500 p-4">
                  <div className="text-sm text-red-300 font-semibold mb-2">TIMEFRAME:</div>
                  <p>{currentScenario.timeframe}</p>
                </div>

                <div className="bg-orange-900/30 border-l-4 border-orange-500 p-4">
                  <div className="text-sm text-orange-300 font-semibold mb-2">COMPETING FORCES:</div>
                  <p>{currentScenario.competingForces}</p>
                </div>

                <div className="mt-8">
                  <label className="block text-sm font-medium mb-2">
                    As {currentScenario.leader.split('of')[0].trim()}, what is your next move?
                  </label>
                  <textarea
                    value={decision}
                    onChange={(e) => setDecision(e.target.value)}
                    className="w-full p-4 bg-slate-800 border border-slate-600 rounded-lg min-h-[120px] focus:outline-none focus:border-purple-500"
                    placeholder="Enter your decision..."
                    disabled={loading}
                  />
                  <button
                    onClick={submitDecision}
                    disabled={loading || !decision.trim()}
                    className="mt-4 w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-6 py-3 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50"
                  >
                    {loading ? 'Processing...' : 'Submit Decision'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar - State of Affairs */}
        <div className="w-80 bg-slate-800 p-6 border-l border-slate-700">
          <h3 className="text-xl font-bold mb-6">State of Affairs</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Stability</span>
                <span>{gameState.universeState.stability}%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${
                    gameState.universeState.stability > 60 ? 'bg-green-500' : 
                    gameState.universeState.stability > 30 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${gameState.universeState.stability}%` }}
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Tech Level</span>
                <span>{gameState.universeState.tech}%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${
                    gameState.universeState.tech > 60 ? 'bg-green-500' : 
                    gameState.universeState.tech > 30 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${gameState.universeState.tech}%` }}
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Economic Power</span>
                <span>{gameState.universeState.economic}%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${
                    gameState.universeState.economic > 60 ? 'bg-green-500' : 
                    gameState.universeState.economic > 30 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${gameState.universeState.economic}%` }}
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Environment</span>
                <span>{gameState.universeState.environment}%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${
                    gameState.universeState.environment > 60 ? 'bg-green-500' : 
                    gameState.universeState.environment > 30 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${gameState.universeState.environment}%` }}
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Social Cohesion</span>
                <span>{gameState.universeState.social}%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${
                    gameState.universeState.social > 60 ? 'bg-green-500' : 
                    gameState.universeState.social > 30 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${gameState.universeState.social}%` }}
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Military Tension</span>
                <span>{gameState.universeState.military}%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${
                    gameState.universeState.military > 60 ? 'bg-green-500' : 
                    gameState.universeState.military > 30 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${gameState.universeState.military}%` }}
                />
              </div>
            </div>
          </div>

          <h3 className="text-xl font-bold mt-8 mb-4">Decision History</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {gameState.decisions.map((decision, index) => (
              <div key={index} className="bg-slate-700 p-3 rounded text-sm">
                <div className="font-semibold text-purple-400">Scene {decision.scene}</div>
                <div className="text-xs text-gray-400">{decision.leader}</div>
                <div className="mt-1">{decision.decision.substring(0, 100)}...</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
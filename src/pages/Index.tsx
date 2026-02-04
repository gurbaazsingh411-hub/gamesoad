import { useState } from 'react';
import { MainMenu } from '@/components/game/MainMenu';
import { GameScreen } from '@/components/game/GameScreen';

type GameState = 'menu' | 'playing';

const Index = () => {
  const [gameState, setGameState] = useState<GameState>('menu');

  const handleStartGame = () => {
    setGameState('playing');
  };

  const handleMainMenu = () => {
    setGameState('menu');
  };

  return (
    <div className="min-h-screen bg-background">
      {gameState === 'menu' && (
        <MainMenu onStartGame={handleStartGame} />
      )}
      {gameState === 'playing' && (
        <GameScreen onMainMenu={handleMainMenu} />
      )}
    </div>
  );
};

export default Index;

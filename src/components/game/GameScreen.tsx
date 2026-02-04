import { useState, useCallback, useRef, useEffect } from 'react';
import { PhaserGame, PhaserGameRef } from '@/game/PhaserGame';
import { GameHUD } from './GameHUD';
import { DialogueBox } from './DialogueBox';
import { VictoryScreen } from './VictoryScreen';
import { DIALOGUES } from '@/game/config';

interface GameScreenProps {
  onMainMenu: () => void;
  startScene?: 'forest' | 'mountains';
}

export function GameScreen({ onMainMenu, startScene = 'forest' }: GameScreenProps) {
  const gameRef = useRef<PhaserGameRef>(null);
  const [health, setHealth] = useState({ soadHealth: 100, gurbaazHealth: 100, maxHealth: 100 });
  const [currentDialogue, setCurrentDialogue] = useState<keyof typeof DIALOGUES | null>(null);
  const [dialogueCallback, setDialogueCallback] = useState<(() => void) | null>(null);
  const [showVictory, setShowVictory] = useState(false);
  const [currentScene, setCurrentScene] = useState<'forest' | 'mountains'>(startScene);
  const [showSceneTransition, setShowSceneTransition] = useState(false);

  const handleHealthUpdate = useCallback((newHealth: { soadHealth: number; gurbaazHealth: number; maxHealth: number }) => {
    setHealth(newHealth);
  }, []);

  const handleDialogue = useCallback((data: { dialogueKey: string; onComplete?: () => void }) => {
    setCurrentDialogue(data.dialogueKey as keyof typeof DIALOGUES);
    setDialogueCallback(() => data.onComplete || null);
  }, []);

  const handleDialogueComplete = useCallback(() => {
    setCurrentDialogue(null);
    if (dialogueCallback) {
      dialogueCallback();
      setDialogueCallback(null);
    }
  }, [dialogueCallback]);

  const handleSceneComplete = useCallback((scene: string) => {
    if (scene === 'forest') {
      // Transition to mountains
      setShowSceneTransition(true);
      setTimeout(() => {
        setCurrentScene('mountains');
        setHealth({ soadHealth: 100, gurbaazHealth: 100, maxHealth: 100 });
        if (gameRef.current?.game) {
          gameRef.current.game.scene.stop('ForestScene');
          gameRef.current.game.scene.start('MountainsScene');
        }
        setTimeout(() => setShowSceneTransition(false), 500);
      }, 1000);
    } else if (scene === 'mountains') {
      setShowVictory(true);
    }
  }, []);

  const handleVictory = useCallback(() => {
    setShowVictory(true);
  }, []);

  const handleRestart = useCallback(() => {
    setShowVictory(false);
    setCurrentScene('forest');
    setHealth({ soadHealth: 100, gurbaazHealth: 100, maxHealth: 100 });
    // Restart the game from forest
    if (gameRef.current?.game) {
      gameRef.current.game.scene.stop('MountainsScene');
      gameRef.current.game.scene.stop('ForestScene');
      gameRef.current.game.scene.start('ForestScene');
    }
  }, []);

  return (
    <div className="relative w-full h-screen bg-background overflow-hidden">
      {/* Scene transition overlay */}
      {showSceneTransition && (
        <div className="fixed inset-0 z-50 bg-background flex items-center justify-center animate-pulse">
          <p className="font-pixel text-primary text-lg">ENTERING ASHEN MOUNTAINS...</p>
        </div>
      )}

      {/* Phaser game canvas */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full max-w-4xl aspect-[4/3] relative scanlines">
          <PhaserGame
            ref={gameRef}
            startScene={currentScene}
            onHealthUpdate={handleHealthUpdate}
            onDialogue={handleDialogue}
            onSceneComplete={handleSceneComplete}
            onVictory={handleVictory}
          />
        </div>
      </div>

      {/* HUD overlay */}
      <GameHUD
        soadHealth={health.soadHealth}
        gurbaazHealth={health.gurbaazHealth}
        maxHealth={health.maxHealth}
        currentScene={currentScene}
      />

      {/* Dialogue overlay */}
      <DialogueBox
        dialogueKey={currentDialogue}
        onComplete={handleDialogueComplete}
      />

      {/* Victory screen */}
      {showVictory && (
        <VictoryScreen
          onRestart={handleRestart}
          onMainMenu={onMainMenu}
        />
      )}

      {/* Controls reminder (bottom right) */}
      <div className="fixed bottom-4 right-4 bg-card/60 backdrop-blur-sm rounded-sm px-3 py-2 border border-border/50">
        <div className="flex gap-4 text-muted-foreground">
          <div className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-muted rounded text-[8px] font-pixel">WASD</kbd>
            <span className="text-[8px] font-pixel">MOVE</span>
          </div>
          <div className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-muted rounded text-[8px] font-pixel">SPACE</kbd>
            <span className="text-[8px] font-pixel">ATTACK</span>
          </div>
        </div>
      </div>
    </div>
  );
}

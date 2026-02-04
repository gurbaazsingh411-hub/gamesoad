import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene';
import { ForestScene } from './scenes/ForestScene';
import { MountainsScene } from './scenes/MountainsScene';
import { GAME_WIDTH, GAME_HEIGHT } from './config';

interface PhaserGameProps {
  onHealthUpdate?: (health: { soadHealth: number; gurbaazHealth: number; maxHealth: number }) => void;
  onDialogue?: (data: { dialogueKey: string; onComplete?: () => void }) => void;
  onSceneReady?: (scene: string) => void;
  startScene?: string;
  onSceneComplete?: (scene: string) => void;
  onVictory?: () => void;
}

export interface PhaserGameRef {
  game: Phaser.Game | null;
}

export const PhaserGame = forwardRef<PhaserGameRef, PhaserGameProps>(({
  onHealthUpdate,
  onDialogue,
  onSceneReady,
  onSceneComplete,
  onVictory,
  startScene = 'forest',
}, ref) => {
  const gameRef = useRef<Phaser.Game | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const startSceneRef = useRef(startScene);

  useImperativeHandle(ref, () => ({
    game: gameRef.current,
  }));

  useEffect(() => {
    if (!containerRef.current || gameRef.current) return;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: GAME_WIDTH,
      height: GAME_HEIGHT,
      parent: containerRef.current,
      backgroundColor: startSceneRef.current === 'mountains' ? '#1a1a1a' : '#1a3a2a',
      pixelArt: true,
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      scene: [BootScene, ForestScene, MountainsScene],
    };

    gameRef.current = new Phaser.Game(config);

    // Setup event listeners
    gameRef.current.events.on('healthUpdate', (health: { soadHealth: number; gurbaazHealth: number; maxHealth: number }) => {
      onHealthUpdate?.(health);
    });

    gameRef.current.events.on('showDialogue', (data: { dialogueKey: string; onComplete?: () => void }) => {
      onDialogue?.(data);
    });

    gameRef.current.events.on('sceneReady', (scene: string) => {
      onSceneReady?.(scene);
    });

    gameRef.current.events.on('sceneComplete', (scene: string) => {
      onSceneComplete?.(scene);
    });

    gameRef.current.events.on('victory', () => {
      onVictory?.();
    });

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, [onHealthUpdate, onDialogue, onSceneReady, onSceneComplete, onVictory]);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full flex items-center justify-center pixel-art"
    />
  );
});

PhaserGame.displayName = 'PhaserGame';

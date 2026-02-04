import { motion } from 'framer-motion';
import { Heart, Shield, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Sword } from 'lucide-react';
import { useEffect, useState } from 'react';

interface GameHUDProps {
  soadHealth: number;
  gurbaazHealth: number;
  maxHealth: number;
  currentScene?: 'forest' | 'mountains';
}

const sceneNames: Record<string, { name: string; color: string }> = {
  forest: { name: 'FORGOTTEN FOREST', color: 'text-secondary' },
  mountains: { name: 'ASHEN MOUNTAINS', color: 'text-accent' },
};

export function GameHUD({ soadHealth, gurbaazHealth, maxHealth, currentScene = 'forest' }: GameHUDProps) {
  const soadPercent = (soadHealth / maxHealth) * 100;
  const gurbaazPercent = (gurbaazHealth / maxHealth) * 100;
  const sceneInfo = sceneNames[currentScene];

  return (
    <div className="game-hud">
      {/* Left side - Character health bars */}
      <div className="flex flex-col gap-3 pointer-events-auto">
        {/* Soad */}
        <motion.div
          className="flex items-center gap-2 bg-card/80 backdrop-blur-sm rounded-sm p-2 border border-primary/30"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-8 h-8 bg-primary/80 rounded-sm flex items-center justify-center">
            <Heart className="w-4 h-4 text-primary-foreground" />
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-pixel text-[8px] text-primary">SOAD</span>
            <div className="w-24 health-bar">
              <motion.div
                className={`health-bar-fill ${soadPercent < 30 ? 'low' : ''}`}
                initial={{ width: '100%' }}
                animate={{ width: `${soadPercent}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
          <span className="font-pixel text-[8px] text-foreground/80 ml-1">
            {soadHealth}/{maxHealth}
          </span>
        </motion.div>

        {/* Gurbaaz */}
        <motion.div
          className="flex items-center gap-2 bg-card/80 backdrop-blur-sm rounded-sm p-2 border border-secondary/30"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="w-8 h-8 bg-secondary rounded-sm flex items-center justify-center">
            <Shield className="w-4 h-4 text-secondary-foreground" />
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-pixel text-[8px] text-secondary-foreground">GURBAAZ</span>
            <div className="w-24 health-bar">
              <motion.div
                className={`health-bar-fill ${gurbaazPercent < 30 ? 'low' : ''}`}
                initial={{ width: '100%' }}
                animate={{ width: `${gurbaazPercent}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
          <span className="font-pixel text-[8px] text-foreground/80 ml-1">
            {gurbaazHealth}/{maxHealth}
          </span>
        </motion.div>
      </div>

      {/* Right side - Scene info */}
      <motion.div
        className={`bg-card/80 backdrop-blur-sm rounded-sm px-4 py-2 border pointer-events-auto ${currentScene === 'mountains' ? 'border-accent/50' : 'border-secondary/50'}`}
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        key={currentScene}
      >
        <span className={`font-pixel text-[10px] ${sceneInfo.color}`}>{sceneInfo.name}</span>
      </motion.div>


      {/* Mobile Controls */}
      <div className="fixed bottom-8 left-8 flex flex-col items-center gap-2 pointer-events-auto md:hidden">
        <button
          className="w-12 h-12 bg-black/50 rounded-full flex items-center justify-center active:bg-primary/50 border border-primary/30"
          onPointerDown={() => window.dispatchEvent(new CustomEvent('game-input', { detail: { action: 'up', pressed: true } }))}
          onPointerUp={() => window.dispatchEvent(new CustomEvent('game-input', { detail: { action: 'up', pressed: false } }))}
          onPointerLeave={() => window.dispatchEvent(new CustomEvent('game-input', { detail: { action: 'up', pressed: false } }))}
        >
          <ArrowUp className="w-6 h-6 text-white" />
        </button>
        <div className="flex gap-2">
          <button
            className="w-12 h-12 bg-black/50 rounded-full flex items-center justify-center active:bg-primary/50 border border-primary/30"
            onPointerDown={() => window.dispatchEvent(new CustomEvent('game-input', { detail: { action: 'left', pressed: true } }))}
            onPointerUp={() => window.dispatchEvent(new CustomEvent('game-input', { detail: { action: 'left', pressed: false } }))}
            onPointerLeave={() => window.dispatchEvent(new CustomEvent('game-input', { detail: { action: 'left', pressed: false } }))}
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <button
            className="w-12 h-12 bg-black/50 rounded-full flex items-center justify-center active:bg-primary/50 border border-primary/30"
            onPointerDown={() => window.dispatchEvent(new CustomEvent('game-input', { detail: { action: 'down', pressed: true } }))}
            onPointerUp={() => window.dispatchEvent(new CustomEvent('game-input', { detail: { action: 'down', pressed: false } }))}
            onPointerLeave={() => window.dispatchEvent(new CustomEvent('game-input', { detail: { action: 'down', pressed: false } }))}
          >
            <ArrowDown className="w-6 h-6 text-white" />
          </button>
          <button
            className="w-12 h-12 bg-black/50 rounded-full flex items-center justify-center active:bg-primary/50 border border-primary/30"
            onPointerDown={() => window.dispatchEvent(new CustomEvent('game-input', { detail: { action: 'right', pressed: true } }))}
            onPointerUp={() => window.dispatchEvent(new CustomEvent('game-input', { detail: { action: 'right', pressed: false } }))}
            onPointerLeave={() => window.dispatchEvent(new CustomEvent('game-input', { detail: { action: 'right', pressed: false } }))}
          >
            <ArrowRight className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>

      <div className="fixed bottom-8 right-8 pointer-events-auto md:hidden">
        <button
          className="w-16 h-16 bg-red-900/50 rounded-full flex items-center justify-center active:bg-red-600/50 border border-red-500/30"
          onPointerDown={() => window.dispatchEvent(new CustomEvent('game-input', { detail: { action: 'attack', pressed: true } }))}
          onPointerUp={() => window.dispatchEvent(new CustomEvent('game-input', { detail: { action: 'attack', pressed: false } }))}
          onPointerLeave={() => window.dispatchEvent(new CustomEvent('game-input', { detail: { action: 'attack', pressed: false } }))}
        >
          <Sword className="w-8 h-8 text-white" />
        </button>
      </div>

    </div >
  );
}

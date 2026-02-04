import { motion } from 'framer-motion';
import { Trophy, Home, RotateCcw } from 'lucide-react';

interface VictoryScreenProps {
  onRestart: () => void;
  onMainMenu: () => void;
}

export function VictoryScreen({ onRestart, onMainMenu }: VictoryScreenProps) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="text-center">
        {/* Victory icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.3, duration: 0.6, type: 'spring' }}
          className="mb-8"
        >
          <Trophy className="w-24 h-24 mx-auto text-gold ember-glow" />
        </motion.div>

        {/* Title */}
        <motion.h1
          className="font-pixel text-3xl md:text-4xl title-shimmer mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          VICTORY!
        </motion.h1>

        <motion.p
          className="font-pixel text-xs text-muted-foreground mb-8 max-w-md mx-auto leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          The Flame Drake has fallen.<br />
          The Demon Citadel awaits...
        </motion.p>

        {/* Stats */}
        <motion.div
          className="bg-card/50 rounded-sm p-4 mb-8 inline-block border border-primary/30"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.9, duration: 0.5 }}
        >
          <div className="font-pixel text-[10px] text-primary mb-2">CHAPTERS COMPLETE</div>
          <div className="font-pixel text-xs text-foreground">Act 1: The Forgotten Forest ✓</div>
          <div className="font-pixel text-xs text-accent mt-1">Act 2: Ashen Mountains ✓</div>
        </motion.div>

        {/* Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.5 }}
        >
          <button
            onClick={onRestart}
            className="game-button flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>PLAY AGAIN</span>
          </button>
          
          <button
            onClick={onMainMenu}
            className="game-button-secondary flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>MAIN MENU</span>
          </button>
        </motion.div>

        {/* Coming soon message */}
        <motion.p
          className="font-pixel text-[8px] text-muted-foreground mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
        >
          MORE CHAPTERS COMING SOON...
        </motion.p>
      </div>
    </motion.div>
  );
}

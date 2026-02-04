import { motion } from 'framer-motion';
import { Sword, Play, BookOpen, Settings } from 'lucide-react';

interface MainMenuProps {
  onStartGame: () => void;
}

export function MainMenu({ onStartGame }: MainMenuProps) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      {/* Animated background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-accent/20 via-background to-background" />
      
      {/* Ember particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary rounded-full"
            initial={{
              x: Math.random() * 100 + '%',
              y: '100%',
              opacity: 0,
            }}
            animate={{
              y: '-10%',
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 4,
              ease: 'linear',
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        {/* Logo/Title */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <motion.div
            className="mb-6"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Sword className="w-16 h-16 mx-auto text-primary ember-glow" />
          </motion.div>
          
          <h1 className="font-pixel text-3xl md:text-5xl title-shimmer mb-4 leading-relaxed">
            BLADES OF
          </h1>
          <h1 className="font-pixel text-4xl md:text-6xl title-shimmer leading-relaxed">
            EMBERFALL
          </h1>
          
          <motion.p
            className="mt-6 text-muted-foreground font-pixel text-xs tracking-wider"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            A TALE OF TWO SIBLINGS
          </motion.p>
        </motion.div>

        {/* Menu buttons */}
        <motion.div
          className="flex flex-col gap-4 w-full max-w-xs"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <button
            onClick={onStartGame}
            className="game-button flex items-center justify-center gap-3 w-full animate-pulse-glow"
          >
            <Play className="w-5 h-5" />
            <span>NEW GAME</span>
          </button>
          
          <button
            className="game-button-secondary flex items-center justify-center gap-3 w-full opacity-50 cursor-not-allowed"
            disabled
          >
            <BookOpen className="w-4 h-4" />
            <span>CONTINUE</span>
          </button>
          
          <button
            className="game-button-secondary flex items-center justify-center gap-3 w-full opacity-50 cursor-not-allowed"
            disabled
          >
            <Settings className="w-4 h-4" />
            <span>OPTIONS</span>
          </button>
        </motion.div>

        {/* Characters preview */}
        <motion.div
          className="mt-16 flex gap-8 items-end"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          {/* Soad */}
          <motion.div
            className="text-center"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="w-12 h-16 bg-primary/80 rounded-sm pixel-art mx-auto mb-2" 
                 style={{ 
                   boxShadow: '0 0 20px hsl(35 90% 55% / 0.4)',
                   background: 'linear-gradient(180deg, #f5a623 0%, #e08e1b 100%)'
                 }} 
            />
            <span className="font-pixel text-[8px] text-primary">SOAD</span>
          </motion.div>
          
          {/* Gurbaaz */}
          <motion.div
            className="text-center"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          >
            <div className="w-14 h-20 bg-secondary rounded-sm pixel-art mx-auto mb-2"
                 style={{ 
                   boxShadow: '0 0 15px hsl(150 40% 25% / 0.4)',
                   background: 'linear-gradient(180deg, #2e5090 0%, #1e3a6a 100%)'
                 }} 
            />
            <span className="font-pixel text-[8px] text-secondary-foreground">GURBAAZ</span>
          </motion.div>
        </motion.div>

        {/* Controls hint */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <p className="font-pixel text-[8px] text-muted-foreground mb-2">CONTROLS</p>
          <div className="flex gap-6 text-muted-foreground">
            <div className="flex items-center gap-2">
              <kbd className="px-2 py-1 bg-muted rounded text-xs font-pixel">WASD</kbd>
              <span className="text-[10px]">MOVE</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="px-2 py-1 bg-muted rounded text-xs font-pixel">SPACE</kbd>
              <span className="text-[10px]">ATTACK</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

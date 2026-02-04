import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DIALOGUES, DialogueLine } from '@/game/config';

interface DialogueBoxProps {
  dialogueKey: keyof typeof DIALOGUES | null;
  onComplete?: () => void;
}

const speakerColors: Record<string, string> = {
  Soad: 'text-primary',
  Gurbaaz: 'text-secondary-foreground',
  Enemy: 'text-destructive',
  Boss: 'text-destructive',
  Narrator: 'text-muted-foreground',
};

const speakerBorders: Record<string, string> = {
  Soad: 'border-primary/60',
  Gurbaaz: 'border-secondary/60',
  Enemy: 'border-destructive/60',
  Boss: 'border-destructive/60',
  Narrator: 'border-muted/60',
};

export function DialogueBox({ dialogueKey, onComplete }: DialogueBoxProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  const dialogues = dialogueKey ? DIALOGUES[dialogueKey] : [];
  const currentDialogue: DialogueLine | undefined = dialogues[currentIndex];

  // Typewriter effect
  useEffect(() => {
    if (!currentDialogue) return;
    
    setDisplayedText('');
    setIsTyping(true);
    
    let index = 0;
    const text = currentDialogue.text;
    
    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.substring(0, index + 1));
        index++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [currentDialogue, currentIndex]);

  const handleAdvance = useCallback(() => {
    if (isTyping) {
      // Skip to full text
      setDisplayedText(currentDialogue?.text || '');
      setIsTyping(false);
    } else if (currentIndex < dialogues.length - 1) {
      // Next dialogue
      setCurrentIndex(currentIndex + 1);
    } else {
      // Complete
      setCurrentIndex(0);
      onComplete?.();
    }
  }, [isTyping, currentDialogue, currentIndex, dialogues.length, onComplete]);

  // Handle key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        handleAdvance();
      }
    };

    if (dialogueKey) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [dialogueKey, handleAdvance]);

  if (!dialogueKey || !currentDialogue) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-x-4 bottom-8 z-50 max-w-2xl mx-auto"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.3 }}
      >
        <div 
          className={`dialogue-box cursor-pointer border-4 ${speakerBorders[currentDialogue.speaker]}`}
          onClick={handleAdvance}
        >
          {/* Speaker name */}
          <div className="mb-2">
            <span className={`font-pixel text-sm ${speakerColors[currentDialogue.speaker]}`}>
              {currentDialogue.speaker === 'Narrator' ? '' : `${currentDialogue.speaker}:`}
            </span>
          </div>

          {/* Dialogue text */}
          <p className={`font-pixel text-xs leading-relaxed text-foreground ${currentDialogue.speaker === 'Narrator' ? 'italic text-muted-foreground' : ''}`}>
            {displayedText}
            {isTyping && <span className="animate-pulse">▌</span>}
          </p>

          {/* Continue indicator */}
          {!isTyping && (
            <motion.div
              className="absolute bottom-2 right-4"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <span className="font-pixel text-[8px] text-muted-foreground">
                PRESS SPACE ▶
              </span>
            </motion.div>
          )}

          {/* Progress indicator */}
          <div className="absolute top-2 right-4">
            <span className="font-pixel text-[8px] text-muted-foreground">
              {currentIndex + 1}/{dialogues.length}
            </span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

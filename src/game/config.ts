import Phaser from 'phaser';

export const GAME_WIDTH = 800;
export const GAME_HEIGHT = 600;

export const COLORS = {
  forest: 0x1a3a2a,
  grass: 0x2d5a3d,
  path: 0x4a3728,
  water: 0x1a4a6a,
  player: 0xf0a030,
  enemy: 0x803030,
  attack: 0xffd700,
};

export const PLAYER_SPEED = 160;
export const ENEMY_SPEED = 80;
export const ATTACK_DURATION = 200;
export const ATTACK_RANGE = 50;

export interface GameState {
  currentScene: 'menu' | 'forest' | 'mountains' | 'citadel' | 'victory';
  soadHealth: number;
  gurbaazHealth: number;
  maxHealth: number;
  currentDialogue: DialogueLine | null;
  enemiesDefeated: number;
  bossDefeated: boolean;
}

export interface DialogueLine {
  speaker: 'Soad' | 'Gurbaaz' | 'Enemy' | 'Boss' | 'Narrator';
  text: string;
  portrait?: string;
}

export const INITIAL_STATE: GameState = {
  currentScene: 'menu',
  soadHealth: 100,
  gurbaazHealth: 100,
  maxHealth: 100,
  currentDialogue: null,
  enemiesDefeated: 0,
  bossDefeated: false,
};

export const DIALOGUES = {
  intro: [
    { speaker: 'Narrator' as const, text: 'The village burns. Smoke fills the crimson sky...' },
    { speaker: 'Soad' as const, text: 'Gurbaaz... why is the sky red?' },
    { speaker: 'Gurbaaz' as const, text: 'The Demon King has awakened. We don\'t have time.' },
    { speaker: 'Soad' as const, text: 'Then let\'s stop him.' },
    { speaker: 'Gurbaaz' as const, text: 'Stay close to me.' },
  ],
  goblinEncounter: [
    { speaker: 'Enemy' as const, text: 'Fresh travelers! Take their gold!' },
    { speaker: 'Soad' as const, text: 'We don\'t have gold...' },
    { speaker: 'Gurbaaz' as const, text: 'Then they picked the wrong fight.' },
  ],
  goblinChief: [
    { speaker: 'Boss' as const, text: 'No one crosses my forest!' },
    { speaker: 'Gurbaaz' as const, text: 'Watch us.' },
  ],
  forestVictory: [
    { speaker: 'Soad' as const, text: 'The path ahead is clear!' },
    { speaker: 'Gurbaaz' as const, text: 'The mountains await. Stay vigilant.' },
  ],
  // Act 2 - Ashen Mountains
  mountainsIntro: [
    { speaker: 'Narrator' as const, text: 'The Ashen Mountains loom ahead, smoke rising from ancient peaks...' },
    { speaker: 'Soad' as const, text: 'The air here... it burns.' },
    { speaker: 'Gurbaaz' as const, text: 'Dragon territory. Keep your blade ready.' },
  ],
  dragonEncounter: [
    { speaker: 'Soad' as const, text: 'That thing is HUGE.' },
    { speaker: 'Gurbaaz' as const, text: 'Good. Bigger targets are easier to hit.' },
  ],
  flameDrake: [
    { speaker: 'Boss' as const, text: 'FOOLISH MORTALS! YOU DARE TRESPASS IN MY DOMAIN?' },
    { speaker: 'Gurbaaz' as const, text: 'Your flames won\'t stop us.' },
    { speaker: 'Soad' as const, text: 'For everyone you\'ve hurt... this ends now!' },
  ],
  mountainsVictory: [
    { speaker: 'Soad' as const, text: 'Did... did we just slay a dragon?' },
    { speaker: 'Gurbaaz' as const, text: 'Together.' },
    { speaker: 'Narrator' as const, text: 'The path to the Demon Citadel now lies open...' },
  ],
};

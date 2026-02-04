import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, COLORS } from '../config';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    // Create loading bar
    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(GAME_WIDTH / 2 - 160, GAME_HEIGHT / 2 - 25, 320, 50);

    this.load.on('progress', (value: number) => {
      progressBar.clear();
      progressBar.fillStyle(0xf0a030, 1);
      progressBar.fillRect(GAME_WIDTH / 2 - 150, GAME_HEIGHT / 2 - 15, 300 * value, 30);
    });

    this.load.on('complete', () => {
      progressBar.destroy();
      progressBox.destroy();
    });

    // Generate placeholder sprites
    this.createPlaceholderSprites();
  }

  createPlaceholderSprites() {
    // Create player sprite (Soad - smaller character)
    const soadGraphics = this.make.graphics({ x: 0, y: 0 });
    soadGraphics.fillStyle(0xf5a623, 1); // Orange/amber
    soadGraphics.fillRect(4, 0, 8, 16); // Body
    soadGraphics.fillStyle(0xffe4c4, 1); // Skin
    soadGraphics.fillRect(5, 1, 6, 5); // Face
    soadGraphics.fillStyle(0x8b4513, 1); // Brown hair
    soadGraphics.fillRect(4, 0, 8, 3);
    soadGraphics.generateTexture('soad', 16, 16);
    soadGraphics.destroy();

    // Create Gurbaaz sprite (larger character)
    const gurbaazGraphics = this.make.graphics({ x: 0, y: 0 });
    gurbaazGraphics.fillStyle(0x2e5090, 1); // Blue armor
    gurbaazGraphics.fillRect(2, 2, 12, 14); // Body
    gurbaazGraphics.fillStyle(0xffe4c4, 1); // Skin
    gurbaazGraphics.fillRect(4, 3, 8, 5); // Face
    gurbaazGraphics.fillStyle(0x1a1a2e, 1); // Dark hair
    gurbaazGraphics.fillRect(3, 1, 10, 4);
    gurbaazGraphics.generateTexture('gurbaaz', 16, 16);
    gurbaazGraphics.destroy();

    // Create goblin sprite
    const goblinGraphics = this.make.graphics({ x: 0, y: 0 });
    goblinGraphics.fillStyle(0x4a7c3f, 1); // Green
    goblinGraphics.fillRect(3, 4, 10, 12); // Body
    goblinGraphics.fillStyle(0x5a9c4f, 1); // Lighter green face
    goblinGraphics.fillRect(4, 5, 8, 6);
    goblinGraphics.fillStyle(0xff0000, 1); // Red eyes
    goblinGraphics.fillRect(5, 6, 2, 2);
    goblinGraphics.fillRect(9, 6, 2, 2);
    goblinGraphics.generateTexture('goblin', 16, 16);
    goblinGraphics.destroy();

    // Create goblin chief sprite (larger)
    const chiefGraphics = this.make.graphics({ x: 0, y: 0 });
    chiefGraphics.fillStyle(0x3a5c2f, 1); // Darker green
    chiefGraphics.fillRect(0, 2, 16, 14); // Body
    chiefGraphics.fillStyle(0x4a7c3f, 1);
    chiefGraphics.fillRect(2, 4, 12, 8);
    chiefGraphics.fillStyle(0xffd700, 1); // Gold crown
    chiefGraphics.fillRect(4, 0, 8, 4);
    chiefGraphics.fillStyle(0xff0000, 1);
    chiefGraphics.fillRect(4, 5, 3, 3);
    chiefGraphics.fillRect(9, 5, 3, 3);
    chiefGraphics.generateTexture('goblin_chief', 16, 16);
    chiefGraphics.destroy();

    // Create attack effect
    const attackGraphics = this.make.graphics({ x: 0, y: 0 });
    attackGraphics.fillStyle(0xffd700, 0.8);
    attackGraphics.fillTriangle(0, 8, 24, 0, 24, 16);
    attackGraphics.generateTexture('attack', 24, 16);
    attackGraphics.destroy();

    // Create sword slash effect
    const slashGraphics = this.make.graphics({ x: 0, y: 0 });
    slashGraphics.lineStyle(3, 0xffffff, 1);
    slashGraphics.arc(16, 16, 14, Phaser.Math.DegToRad(200), Phaser.Math.DegToRad(340), false);
    slashGraphics.strokePath();
    slashGraphics.generateTexture('slash', 32, 32);
    slashGraphics.destroy();

    // Create tree sprite
    const treeGraphics = this.make.graphics({ x: 0, y: 0 });
    treeGraphics.fillStyle(0x228b22, 1); // Forest green
    treeGraphics.fillCircle(16, 10, 14);
    treeGraphics.fillCircle(10, 16, 10);
    treeGraphics.fillCircle(22, 16, 10);
    treeGraphics.fillStyle(0x8b4513, 1); // Brown trunk
    treeGraphics.fillRect(13, 22, 6, 10);
    treeGraphics.generateTexture('tree', 32, 32);
    treeGraphics.destroy();

    // Create grass tile
    const grassGraphics = this.make.graphics({ x: 0, y: 0 });
    grassGraphics.fillStyle(COLORS.grass, 1);
    grassGraphics.fillRect(0, 0, 32, 32);
    grassGraphics.fillStyle(0x3d6a4d, 1);
    grassGraphics.fillRect(4, 8, 2, 4);
    grassGraphics.fillRect(12, 4, 2, 4);
    grassGraphics.fillRect(24, 12, 2, 4);
    grassGraphics.fillRect(20, 24, 2, 4);
    grassGraphics.generateTexture('grass', 32, 32);
    grassGraphics.destroy();

    // Create path tile
    const pathGraphics = this.make.graphics({ x: 0, y: 0 });
    pathGraphics.fillStyle(COLORS.path, 1);
    pathGraphics.fillRect(0, 0, 32, 32);
    pathGraphics.fillStyle(0x5a4738, 1);
    pathGraphics.fillRect(8, 8, 4, 4);
    pathGraphics.fillRect(20, 16, 4, 4);
    pathGraphics.generateTexture('path', 32, 32);
    pathGraphics.destroy();
  }

  create() {
    // Check which scene to start based on game registry
    const startScene = this.registry.get('startScene') || 'ForestScene';
    this.scene.start(startScene);
  }
}

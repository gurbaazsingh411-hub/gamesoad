import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, PLAYER_SPEED, ENEMY_SPEED, ATTACK_RANGE, COLORS } from '../config';

interface Enemy extends Phaser.GameObjects.Sprite {
  health: number;
  maxHealth: number;
  isBoss: boolean;
}

export class ForestScene extends Phaser.Scene {
  private soad!: Phaser.GameObjects.Sprite;
  private gurbaaz!: Phaser.GameObjects.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: { W: Phaser.Input.Keyboard.Key; A: Phaser.Input.Keyboard.Key; S: Phaser.Input.Keyboard.Key; D: Phaser.Input.Keyboard.Key };
  private attackKey!: Phaser.Input.Keyboard.Key;
  private enemies!: Phaser.GameObjects.Group;
  private trees!: Phaser.GameObjects.Group;
  private isAttacking = false;
  private attackCooldown = false;
  private soadHealth = 100;
  private gurbaazHealth = 100;
  private slashEffect?: Phaser.GameObjects.Sprite;
  private bossDefeated = false;
  private introShown = false;

  constructor() {
    super({ key: 'ForestScene' });
  }

  create() {
    // Create forest background
    this.createForestBackground();

    // Create trees (obstacles)
    this.createTrees();

    // Create players
    this.createPlayers();

    // Create enemies
    this.createEnemies();

    // Setup controls
    this.setupControls();

    // Setup collision
    this.setupCollisions();

    // Emit ready event
    this.time.delayedCall(100, () => {
      this.game.events.emit('sceneReady', 'forest');
    });

    // Show intro dialogue
    if (!this.introShown) {
      this.time.delayedCall(500, () => {
        this.game.events.emit('showDialogue', {
          dialogueKey: 'intro',
          onComplete: () => {
            this.introShown = true;
          }
        });
      });
    }
  }

  createForestBackground() {
    // Fill with grass
    for (let x = 0; x < GAME_WIDTH; x += 32) {
      for (let y = 0; y < GAME_HEIGHT; y += 32) {
        this.add.sprite(x + 16, y + 16, 'grass');
      }
    }

    // Add path
    for (let x = 0; x < GAME_WIDTH; x += 32) {
      this.add.sprite(x + 16, GAME_HEIGHT / 2, 'path');
      this.add.sprite(x + 16, GAME_HEIGHT / 2 + 32, 'path');
    }
  }

  createTrees() {
    this.trees = this.add.group();
    
    // Add trees around the edges and scattered
    const treePositions = [
      // Top row
      { x: 50, y: 50 }, { x: 150, y: 40 }, { x: 250, y: 60 },
      { x: 400, y: 45 }, { x: 550, y: 55 }, { x: 700, y: 50 },
      // Bottom row
      { x: 80, y: 520 }, { x: 200, y: 540 }, { x: 350, y: 530 },
      { x: 500, y: 545 }, { x: 650, y: 525 }, { x: 750, y: 540 },
      // Scattered
      { x: 120, y: 180 }, { x: 680, y: 200 }, { x: 100, y: 400 }, { x: 700, y: 420 },
    ];

    treePositions.forEach(pos => {
      const tree = this.add.sprite(pos.x, pos.y, 'tree');
      tree.setScale(2);
      this.trees.add(tree);
    });
  }

  createPlayers() {
    // Soad (player controlled)
    this.soad = this.add.sprite(100, GAME_HEIGHT / 2, 'soad');
    this.soad.setScale(2);
    this.soad.setDepth(10);

    // Gurbaaz (follows Soad)
    this.gurbaaz = this.add.sprite(60, GAME_HEIGHT / 2, 'gurbaaz');
    this.gurbaaz.setScale(2);
    this.gurbaaz.setDepth(10);

    // Create slash effect (hidden initially)
    this.slashEffect = this.add.sprite(0, 0, 'slash');
    this.slashEffect.setScale(1.5);
    this.slashEffect.setVisible(false);
    this.slashEffect.setDepth(15);
  }

  createEnemies() {
    this.enemies = this.add.group();

    // Create regular goblins
    const goblinPositions = [
      { x: 300, y: 200 },
      { x: 400, y: 400 },
      { x: 500, y: 250 },
      { x: 600, y: 350 },
    ];

    goblinPositions.forEach(pos => {
      const goblin = this.add.sprite(pos.x, pos.y, 'goblin') as Enemy;
      goblin.setScale(2);
      goblin.health = 30;
      goblin.maxHealth = 30;
      goblin.isBoss = false;
      this.enemies.add(goblin);
    });

    // Create goblin chief (boss)
    const chief = this.add.sprite(700, GAME_HEIGHT / 2, 'goblin_chief') as Enemy;
    chief.setScale(3);
    chief.health = 100;
    chief.maxHealth = 100;
    chief.isBoss = true;
    this.enemies.add(chief);
  }

  setupControls() {
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.wasd = {
      W: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      A: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      S: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      D: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    };
    this.attackKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  }

  setupCollisions() {
    // Simple bounds checking
    this.soad.setData('bounds', { left: 20, right: GAME_WIDTH - 20, top: 20, bottom: GAME_HEIGHT - 20 });
  }

  update() {
    this.handleMovement();
    this.handleAttack();
    this.updateEnemies();
    this.updateGurbaaz();
    this.checkVictory();
    this.emitHealthUpdate();
  }

  handleMovement() {
    let velocityX = 0;
    let velocityY = 0;

    if (this.cursors.left.isDown || this.wasd.A.isDown) {
      velocityX = -1;
      this.soad.setFlipX(true);
    } else if (this.cursors.right.isDown || this.wasd.D.isDown) {
      velocityX = 1;
      this.soad.setFlipX(false);
    }

    if (this.cursors.up.isDown || this.wasd.W.isDown) {
      velocityY = -1;
    } else if (this.cursors.down.isDown || this.wasd.S.isDown) {
      velocityY = 1;
    }

    // Normalize diagonal movement
    if (velocityX !== 0 && velocityY !== 0) {
      velocityX *= 0.707;
      velocityY *= 0.707;
    }

    const speed = PLAYER_SPEED * (this.game.loop.delta / 1000);
    const newX = this.soad.x + velocityX * speed;
    const newY = this.soad.y + velocityY * speed;

    // Check bounds
    if (newX > 30 && newX < GAME_WIDTH - 30) {
      this.soad.x = newX;
    }
    if (newY > 30 && newY < GAME_HEIGHT - 30) {
      this.soad.y = newY;
    }
  }

  handleAttack() {
    if (Phaser.Input.Keyboard.JustDown(this.attackKey) && !this.attackCooldown) {
      this.isAttacking = true;
      this.attackCooldown = true;

      // Show slash effect
      if (this.slashEffect) {
        this.slashEffect.setPosition(
          this.soad.x + (this.soad.flipX ? -20 : 20),
          this.soad.y
        );
        this.slashEffect.setFlipX(this.soad.flipX);
        this.slashEffect.setVisible(true);
        this.slashEffect.setAlpha(1);

        // Animate slash
        this.tweens.add({
          targets: this.slashEffect,
          alpha: 0,
          scaleX: 2,
          scaleY: 2,
          duration: 150,
          onComplete: () => {
            this.slashEffect?.setVisible(false);
            this.slashEffect?.setScale(1.5);
          }
        });
      }

      // Check for enemy hits
      this.enemies.getChildren().forEach((enemy) => {
        const e = enemy as Enemy;
        const distance = Phaser.Math.Distance.Between(this.soad.x, this.soad.y, e.x, e.y);
        
        if (distance < ATTACK_RANGE + (e.isBoss ? 30 : 0)) {
          this.damageEnemy(e, 25);
        }
      });

      // Cooldown
      this.time.delayedCall(300, () => {
        this.isAttacking = false;
        this.attackCooldown = false;
      });
    }
  }

  damageEnemy(enemy: Enemy, damage: number) {
    enemy.health -= damage;

    // Flash red
    this.tweens.add({
      targets: enemy,
      tint: 0xff0000,
      duration: 100,
      yoyo: true,
      onComplete: () => {
        enemy.clearTint();
      }
    });

    // Show damage number
    const damageText = this.add.text(enemy.x, enemy.y - 20, `-${damage}`, {
      fontSize: '16px',
      color: '#ff4444',
      fontFamily: 'Press Start 2P',
    });
    damageText.setOrigin(0.5);
    this.tweens.add({
      targets: damageText,
      y: enemy.y - 50,
      alpha: 0,
      duration: 800,
      onComplete: () => damageText.destroy(),
    });

    // Check if dead
    if (enemy.health <= 0) {
      if (enemy.isBoss) {
        this.bossDefeated = true;
        // Show boss defeated dialogue
        this.game.events.emit('showDialogue', {
          dialogueKey: 'forestVictory',
          onComplete: () => {
            this.game.events.emit('sceneComplete', 'forest');
          }
        });
      }
      
      // Death animation
      this.tweens.add({
        targets: enemy,
        alpha: 0,
        scaleX: 0,
        scaleY: 0,
        duration: 300,
        onComplete: () => {
          enemy.destroy();
        }
      });
    }
  }

  updateEnemies() {
    this.enemies.getChildren().forEach((enemy) => {
      const e = enemy as Enemy;
      
      // Simple chase AI
      const distanceToSoad = Phaser.Math.Distance.Between(e.x, e.y, this.soad.x, this.soad.y);
      const distanceToGurbaaz = Phaser.Math.Distance.Between(e.x, e.y, this.gurbaaz.x, this.gurbaaz.y);
      
      let targetX = this.soad.x;
      let targetY = this.soad.y;
      
      if (distanceToGurbaaz < distanceToSoad) {
        targetX = this.gurbaaz.x;
        targetY = this.gurbaaz.y;
      }

      const distance = Math.min(distanceToSoad, distanceToGurbaaz);
      
      if (distance < 200 && distance > 30) {
        const angle = Phaser.Math.Angle.Between(e.x, e.y, targetX, targetY);
        const speed = ENEMY_SPEED * (this.game.loop.delta / 1000);
        e.x += Math.cos(angle) * speed;
        e.y += Math.sin(angle) * speed;
        e.setFlipX(targetX < e.x);
      }

      // Attack player if close
      if (distance < 30 && Math.random() < 0.02) {
        if (distanceToSoad < distanceToGurbaaz) {
          this.damageSoad(10);
        } else {
          this.damageGurbaaz(10);
        }
      }
    });
  }

  damageSoad(damage: number) {
    this.soadHealth = Math.max(0, this.soadHealth - damage);
    this.flashRed(this.soad);
  }

  damageGurbaaz(damage: number) {
    this.gurbaazHealth = Math.max(0, this.gurbaazHealth - damage);
    this.flashRed(this.gurbaaz);
  }

  flashRed(target: Phaser.GameObjects.Sprite) {
    this.tweens.add({
      targets: target,
      tint: 0xff0000,
      duration: 100,
      yoyo: true,
      onComplete: () => {
        target.clearTint();
      }
    });
  }

  updateGurbaaz() {
    // Gurbaaz follows Soad with some delay
    const distance = Phaser.Math.Distance.Between(this.gurbaaz.x, this.gurbaaz.y, this.soad.x, this.soad.y);
    
    if (distance > 50) {
      const angle = Phaser.Math.Angle.Between(this.gurbaaz.x, this.gurbaaz.y, this.soad.x, this.soad.y);
      const speed = PLAYER_SPEED * 0.8 * (this.game.loop.delta / 1000);
      this.gurbaaz.x += Math.cos(angle) * speed;
      this.gurbaaz.y += Math.sin(angle) * speed;
      this.gurbaaz.setFlipX(this.soad.x < this.gurbaaz.x);
    }
  }

  checkVictory() {
    if (this.bossDefeated && this.enemies.getLength() === 0) {
      // All enemies defeated
      this.game.events.emit('victory');
    }
  }

  emitHealthUpdate() {
    this.game.events.emit('healthUpdate', {
      soadHealth: this.soadHealth,
      gurbaazHealth: this.gurbaazHealth,
      maxHealth: 100,
    });
  }
}

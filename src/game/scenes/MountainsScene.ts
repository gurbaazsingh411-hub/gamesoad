import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, PLAYER_SPEED, ENEMY_SPEED, ATTACK_RANGE } from '../config';

interface Enemy extends Phaser.GameObjects.Sprite {
  health: number;
  maxHealth: number;
  isBoss: boolean;
  fireTimer?: Phaser.Time.TimerEvent;
}

interface Fireball extends Phaser.GameObjects.Sprite {
  velocityX: number;
  velocityY: number;
}

export class MountainsScene extends Phaser.Scene {
  private soad!: Phaser.GameObjects.Sprite;
  private gurbaaz!: Phaser.GameObjects.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: { W: Phaser.Input.Keyboard.Key; A: Phaser.Input.Keyboard.Key; S: Phaser.Input.Keyboard.Key; D: Phaser.Input.Keyboard.Key };
  private attackKey!: Phaser.Input.Keyboard.Key;
  private enemies!: Phaser.GameObjects.Group;
  private fireballs!: Phaser.GameObjects.Group;
  private rocks!: Phaser.GameObjects.Group;
  private isAttacking = false;
  private attackCooldown = false;
  private soadHealth = 100;
  private gurbaazHealth = 100;
  private slashEffect?: Phaser.GameObjects.Sprite;
  private bossDefeated = false;
  private introShown = false;

  constructor() {
    super({ key: 'MountainsScene' });
  }

  create() {
    // Create mountain background
    this.createMountainBackground();

    // Create rocks (obstacles)
    this.createRocks();

    // Create players
    this.createPlayers();

    // Create placeholder sprites for dragons
    this.createDragonSprites();

    // Create enemies
    this.createEnemies();

    // Setup controls
    this.setupControls();

    // Initialize fireballs group
    this.fireballs = this.add.group();

    // Emit ready event
    this.time.delayedCall(100, () => {
      this.game.events.emit('sceneReady', 'mountains');
    });

    // Show intro dialogue
    if (!this.introShown) {
      this.time.delayedCall(500, () => {
        this.game.events.emit('showDialogue', {
          dialogueKey: 'mountainsIntro',
          onComplete: () => {
            this.introShown = true;
          }
        });
      });
    }
  }

  createDragonSprites() {
    // Create fire drake (small dragon enemy)
    const drakeGraphics = this.make.graphics({ x: 0, y: 0 });
    drakeGraphics.fillStyle(0xff4500, 1); // Orange-red
    drakeGraphics.fillRect(2, 4, 12, 10); // Body
    drakeGraphics.fillStyle(0xff6a00, 1); // Lighter orange
    drakeGraphics.fillRect(4, 6, 8, 6); // Belly
    drakeGraphics.fillStyle(0xffff00, 1); // Yellow eyes
    drakeGraphics.fillRect(3, 5, 2, 2);
    drakeGraphics.fillRect(11, 5, 2, 2);
    // Wings
    drakeGraphics.fillStyle(0xcc3300, 1);
    drakeGraphics.fillTriangle(0, 6, 4, 2, 4, 10);
    drakeGraphics.fillTriangle(16, 6, 12, 2, 12, 10);
    drakeGraphics.generateTexture('fire_drake', 16, 16);
    drakeGraphics.destroy();

    // Create Flame Drake boss (large dragon)
    const bossGraphics = this.make.graphics({ x: 0, y: 0 });
    // Body
    bossGraphics.fillStyle(0x8b0000, 1); // Dark red
    bossGraphics.fillRect(8, 8, 16, 16); // Main body
    bossGraphics.fillStyle(0xff4500, 1); // Orange belly
    bossGraphics.fillRect(10, 12, 12, 10);
    // Head
    bossGraphics.fillStyle(0x8b0000, 1);
    bossGraphics.fillRect(20, 4, 10, 12);
    bossGraphics.fillStyle(0xffff00, 1); // Yellow eyes
    bossGraphics.fillRect(24, 6, 3, 3);
    // Wings
    bossGraphics.fillStyle(0x660000, 1);
    bossGraphics.fillTriangle(4, 16, 0, 0, 12, 8);
    bossGraphics.fillTriangle(20, 16, 32, 0, 24, 8);
    // Tail
    bossGraphics.fillStyle(0x8b0000, 1);
    bossGraphics.fillRect(0, 12, 10, 6);
    // Fire breath glow
    bossGraphics.fillStyle(0xff6600, 0.5);
    bossGraphics.fillCircle(30, 10, 4);
    bossGraphics.generateTexture('flame_drake_boss', 32, 32);
    bossGraphics.destroy();

    // Create fireball
    const fireballGraphics = this.make.graphics({ x: 0, y: 0 });
    fireballGraphics.fillStyle(0xff6600, 1);
    fireballGraphics.fillCircle(8, 8, 6);
    fireballGraphics.fillStyle(0xffff00, 1);
    fireballGraphics.fillCircle(8, 8, 3);
    fireballGraphics.generateTexture('fireball', 16, 16);
    fireballGraphics.destroy();

    // Create mountain rock
    const rockGraphics = this.make.graphics({ x: 0, y: 0 });
    rockGraphics.fillStyle(0x4a4a4a, 1);
    rockGraphics.fillRect(4, 8, 24, 24);
    rockGraphics.fillStyle(0x3a3a3a, 1);
    rockGraphics.fillRect(8, 4, 16, 8);
    rockGraphics.fillStyle(0x5a5a5a, 1);
    rockGraphics.fillRect(8, 12, 8, 8);
    rockGraphics.generateTexture('rock', 32, 32);
    rockGraphics.destroy();

    // Create lava tile
    const lavaGraphics = this.make.graphics({ x: 0, y: 0 });
    lavaGraphics.fillStyle(0x1a1a1a, 1);
    lavaGraphics.fillRect(0, 0, 32, 32);
    lavaGraphics.fillStyle(0xff4500, 0.3);
    lavaGraphics.fillRect(4, 4, 8, 8);
    lavaGraphics.fillRect(20, 16, 8, 8);
    lavaGraphics.fillStyle(0xff6600, 0.2);
    lavaGraphics.fillRect(12, 20, 6, 6);
    lavaGraphics.generateTexture('volcanic_ground', 32, 32);
    lavaGraphics.destroy();

    // Create ash path
    const ashGraphics = this.make.graphics({ x: 0, y: 0 });
    ashGraphics.fillStyle(0x2a2a2a, 1);
    ashGraphics.fillRect(0, 0, 32, 32);
    ashGraphics.fillStyle(0x3a3a3a, 1);
    ashGraphics.fillRect(8, 8, 4, 4);
    ashGraphics.fillRect(20, 20, 4, 4);
    ashGraphics.generateTexture('ash_path', 32, 32);
    ashGraphics.destroy();
  }

  createMountainBackground() {
    // Fill with volcanic ground
    for (let x = 0; x < GAME_WIDTH; x += 32) {
      for (let y = 0; y < GAME_HEIGHT; y += 32) {
        this.add.sprite(x + 16, y + 16, 'volcanic_ground');
      }
    }

    // Add ash path
    for (let x = 0; x < GAME_WIDTH; x += 32) {
      this.add.sprite(x + 16, GAME_HEIGHT / 2, 'ash_path');
      this.add.sprite(x + 16, GAME_HEIGHT / 2 + 32, 'ash_path');
    }

    // Add ambient fire particles
    for (let i = 0; i < 10; i++) {
      const ember = this.add.circle(
        Math.random() * GAME_WIDTH,
        Math.random() * GAME_HEIGHT,
        2,
        0xff4500,
        0.6
      );
      this.tweens.add({
        targets: ember,
        y: ember.y - 100,
        alpha: 0,
        duration: 2000 + Math.random() * 2000,
        repeat: -1,
        delay: Math.random() * 2000,
      });
    }
  }

  createRocks() {
    this.rocks = this.add.group();
    
    const rockPositions = [
      { x: 60, y: 80 }, { x: 200, y: 60 }, { x: 350, y: 80 },
      { x: 500, y: 50 }, { x: 650, y: 70 }, { x: 750, y: 90 },
      { x: 100, y: 500 }, { x: 250, y: 520 }, { x: 400, y: 510 },
      { x: 550, y: 530 }, { x: 700, y: 500 },
      { x: 80, y: 200 }, { x: 720, y: 380 },
    ];

    rockPositions.forEach(pos => {
      const rock = this.add.sprite(pos.x, pos.y, 'rock');
      rock.setScale(1.5);
      this.rocks.add(rock);
    });
  }

  createPlayers() {
    // Soad
    this.soad = this.add.sprite(100, GAME_HEIGHT / 2, 'soad');
    this.soad.setScale(2);
    this.soad.setDepth(10);

    // Gurbaaz
    this.gurbaaz = this.add.sprite(60, GAME_HEIGHT / 2, 'gurbaaz');
    this.gurbaaz.setScale(2);
    this.gurbaaz.setDepth(10);

    // Slash effect
    this.slashEffect = this.add.sprite(0, 0, 'slash');
    this.slashEffect.setScale(1.5);
    this.slashEffect.setVisible(false);
    this.slashEffect.setDepth(15);
  }

  createEnemies() {
    this.enemies = this.add.group();

    // Create fire drakes
    const drakePositions = [
      { x: 250, y: 150 },
      { x: 350, y: 400 },
      { x: 450, y: 200 },
      { x: 550, y: 380 },
      { x: 300, y: 300 },
    ];

    drakePositions.forEach(pos => {
      const drake = this.add.sprite(pos.x, pos.y, 'fire_drake') as Enemy;
      drake.setScale(2.5);
      drake.health = 40;
      drake.maxHealth = 40;
      drake.isBoss = false;
      this.enemies.add(drake);
    });

    // Create Flame Drake boss
    const boss = this.add.sprite(700, GAME_HEIGHT / 2, 'flame_drake_boss') as Enemy;
    boss.setScale(3);
    boss.health = 200;
    boss.maxHealth = 200;
    boss.isBoss = true;
    this.enemies.add(boss);

    // Boss fire attack timer
    boss.fireTimer = this.time.addEvent({
      delay: 2000,
      callback: () => this.bossFireAttack(boss),
      loop: true,
    });

    // Show dragon encounter dialogue after a delay
    this.time.delayedCall(3000, () => {
      this.game.events.emit('showDialogue', {
        dialogueKey: 'dragonEncounter',
      });
    });
  }

  bossFireAttack(boss: Enemy) {
    if (!boss.active || boss.health <= 0) return;

    // Fire 3 fireballs in spread pattern
    const angles = [-0.3, 0, 0.3];
    const baseAngle = Phaser.Math.Angle.Between(boss.x, boss.y, this.soad.x, this.soad.y);

    angles.forEach(offset => {
      const fireball = this.add.sprite(boss.x - 20, boss.y, 'fireball') as Fireball;
      fireball.setScale(1.5);
      const angle = baseAngle + offset;
      fireball.velocityX = Math.cos(angle) * 200;
      fireball.velocityY = Math.sin(angle) * 200;
      this.fireballs.add(fireball);

      // Add glow effect
      this.tweens.add({
        targets: fireball,
        scaleX: 1.8,
        scaleY: 1.8,
        yoyo: true,
        duration: 200,
        repeat: -1,
      });
    });
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

  update() {
    this.handleMovement();
    this.handleAttack();
    this.updateEnemies();
    this.updateFireballs();
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

    if (velocityX !== 0 && velocityY !== 0) {
      velocityX *= 0.707;
      velocityY *= 0.707;
    }

    const speed = PLAYER_SPEED * (this.game.loop.delta / 1000);
    const newX = this.soad.x + velocityX * speed;
    const newY = this.soad.y + velocityY * speed;

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

      if (this.slashEffect) {
        this.slashEffect.setPosition(
          this.soad.x + (this.soad.flipX ? -20 : 20),
          this.soad.y
        );
        this.slashEffect.setFlipX(this.soad.flipX);
        this.slashEffect.setVisible(true);
        this.slashEffect.setAlpha(1);

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

      this.enemies.getChildren().forEach((enemy) => {
        const e = enemy as Enemy;
        const distance = Phaser.Math.Distance.Between(this.soad.x, this.soad.y, e.x, e.y);
        
        if (distance < ATTACK_RANGE + (e.isBoss ? 50 : 10)) {
          this.damageEnemy(e, e.isBoss ? 20 : 30);
        }
      });

      this.time.delayedCall(300, () => {
        this.isAttacking = false;
        this.attackCooldown = false;
      });
    }
  }

  damageEnemy(enemy: Enemy, damage: number) {
    enemy.health -= damage;

    this.tweens.add({
      targets: enemy,
      tint: 0xffffff,
      duration: 100,
      yoyo: true,
      onComplete: () => {
        enemy.clearTint();
      }
    });

    const damageText = this.add.text(enemy.x, enemy.y - 30, `-${damage}`, {
      fontSize: '18px',
      color: '#ff6600',
      fontFamily: 'Press Start 2P',
    });
    damageText.setOrigin(0.5);
    this.tweens.add({
      targets: damageText,
      y: enemy.y - 60,
      alpha: 0,
      duration: 800,
      onComplete: () => damageText.destroy(),
    });

    if (enemy.health <= 0) {
      if (enemy.isBoss) {
        this.bossDefeated = true;
        if (enemy.fireTimer) enemy.fireTimer.destroy();
        
        // Dramatic boss death
        this.cameras.main.shake(500, 0.02);
        
        this.game.events.emit('showDialogue', {
          dialogueKey: 'mountainsVictory',
          onComplete: () => {
            this.game.events.emit('sceneComplete', 'mountains');
          }
        });
      }
      
      // Fire explosion effect for dragons
      for (let i = 0; i < 8; i++) {
        const spark = this.add.circle(
          enemy.x + (Math.random() - 0.5) * 40,
          enemy.y + (Math.random() - 0.5) * 40,
          4,
          0xff4500
        );
        this.tweens.add({
          targets: spark,
          x: spark.x + (Math.random() - 0.5) * 80,
          y: spark.y + (Math.random() - 0.5) * 80,
          alpha: 0,
          scale: 0,
          duration: 400,
          onComplete: () => spark.destroy(),
        });
      }

      this.tweens.add({
        targets: enemy,
        alpha: 0,
        scaleX: 0,
        scaleY: 0,
        duration: 400,
        onComplete: () => {
          enemy.destroy();
        }
      });
    }
  }

  updateEnemies() {
    this.enemies.getChildren().forEach((enemy) => {
      const e = enemy as Enemy;
      
      const distanceToSoad = Phaser.Math.Distance.Between(e.x, e.y, this.soad.x, this.soad.y);
      const distanceToGurbaaz = Phaser.Math.Distance.Between(e.x, e.y, this.gurbaaz.x, this.gurbaaz.y);
      
      let targetX = this.soad.x;
      let targetY = this.soad.y;
      
      if (distanceToGurbaaz < distanceToSoad) {
        targetX = this.gurbaaz.x;
        targetY = this.gurbaaz.y;
      }

      const distance = Math.min(distanceToSoad, distanceToGurbaaz);
      
      // Dragons have longer aggro range
      const aggroRange = e.isBoss ? 400 : 250;
      const minDistance = e.isBoss ? 100 : 40;
      
      if (distance < aggroRange && distance > minDistance) {
        const angle = Phaser.Math.Angle.Between(e.x, e.y, targetX, targetY);
        const speed = (e.isBoss ? ENEMY_SPEED * 0.5 : ENEMY_SPEED * 1.2) * (this.game.loop.delta / 1000);
        e.x += Math.cos(angle) * speed;
        e.y += Math.sin(angle) * speed;
        e.setFlipX(targetX < e.x);
      }

      // Non-boss dragons do contact damage
      if (!e.isBoss && distance < 35 && Math.random() < 0.02) {
        if (distanceToSoad < distanceToGurbaaz) {
          this.damageSoad(15);
        } else {
          this.damageGurbaaz(15);
        }
      }
    });
  }

  updateFireballs() {
    this.fireballs.getChildren().forEach((fb) => {
      const fireball = fb as Fireball;
      const delta = this.game.loop.delta / 1000;
      fireball.x += fireball.velocityX * delta;
      fireball.y += fireball.velocityY * delta;

      // Check bounds
      if (fireball.x < -20 || fireball.x > GAME_WIDTH + 20 || 
          fireball.y < -20 || fireball.y > GAME_HEIGHT + 20) {
        fireball.destroy();
        return;
      }

      // Check collision with players
      const distToSoad = Phaser.Math.Distance.Between(fireball.x, fireball.y, this.soad.x, this.soad.y);
      const distToGurbaaz = Phaser.Math.Distance.Between(fireball.x, fireball.y, this.gurbaaz.x, this.gurbaaz.y);

      if (distToSoad < 25) {
        this.damageSoad(20);
        this.createFireHitEffect(fireball.x, fireball.y);
        fireball.destroy();
      } else if (distToGurbaaz < 25) {
        this.damageGurbaaz(20);
        this.createFireHitEffect(fireball.x, fireball.y);
        fireball.destroy();
      }
    });
  }

  createFireHitEffect(x: number, y: number) {
    for (let i = 0; i < 6; i++) {
      const spark = this.add.circle(x, y, 3, 0xff6600);
      this.tweens.add({
        targets: spark,
        x: x + (Math.random() - 0.5) * 60,
        y: y + (Math.random() - 0.5) * 60,
        alpha: 0,
        duration: 300,
        onComplete: () => spark.destroy(),
      });
    }
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

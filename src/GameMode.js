import { Enemy } from "./Enemy.js";
import { Player } from "./Player.js";
import { Collectable } from "./Collectable.js";
import { EnvironmentEntity, Meteor } from "./Environment.js";

export class GameMode {
  constructor(game, playerImage) {
    game.player = new Player(playerImage);
    game.enemies = [];
    game.collectables = [];
    game.environmentEntities = [];
    game.score = 0;
    game.lastScore = 0;
    game.pause = () => {
      window.dispatchEvent(new Event("GAME_PAUSED"));
    };
  }

  createEnemies(game, ENEMIES_NUMBER, enemyImage) {
    for (let i = 0; i < ENEMIES_NUMBER; ++i) {
      game.enemies.push(new Enemy(enemyImage));
    }
  }

  createCollectables(game, COLLECTABLE_NUMBER, collectableImage) {
    for (let i = 0; i < COLLECTABLE_NUMBER; ++i) {
      game.collectables.push(new Collectable(collectableImage));
    }
  }

  createEnvironment(game, ENVIRONMENT_NUMBER, environmentImage) {
    for (let i = 0; i < ENVIRONMENT_NUMBER; ++i) {
      game.environmentEntities.push(new EnvironmentEntity(environmentImage));
    }
  }
}

export class GameModeClassic extends GameMode {
  constructor(game) {
    super(game, document.getElementById("player_plane_1"));
    this.createEnemies(game);
    super.createCollectables(
      game,
      25,
      document.getElementById("collectable_1")
    );
    game.drawMainBoard = (ctx) => {
      document.body.style.backgroundImage = `url("../assets/environment_background_1.png")`;
      document.body.style.backgroundSize = "100% 100%";
    };
    setInterval(() => this.regularUpdate(game), 1000);
    setInterval(() => this.createMetoerites(game), 10000);
    this.initiliaseNormalSound();
    this.initliaseDramaticSound();
    this.playNormalSound();
    this.lastMusic = "normal";
  }

  regularUpdate(game) {
    if (game.collectables.length < 10) {
      this.createCollectables(game);
    }
    if (game.enemies.length < 5) {
      this.createEnemies(game);
    }
    if (game.score - game.lastScore > 100) {
      game.lastScore = game.score + 90;
      this.createSuperCollectable(game);
      this.createSuperEnemy(game);
    }
  }

  createCollectables(game) {
    super.createCollectables(game, 5, document.getElementById("collectable_1"));
  }

  createEnemies(game) {
    super.createEnemies(game, 2, document.getElementById("enemy_plane_1"));
  }

  createMetoerites(game) {
    for (let i = 0; i < Math.random() * 5; ++i) {
      game.environmentEntities.push(
        new Meteor(document.getElementById("meteor_1"))
      );
    }
  }

  createSuperEnemy(game) {
    const superEnemy = new Enemy(
      document.getElementById("super_enemy_plane_1")
    );
    superEnemy.length = 150;
    superEnemy.width = 150;
    superEnemy.dx = 150;
    superEnemy.dy = 150;
    superEnemy.maxVelocity = 130;
    superEnemy.healthChangeStep = -10;
    superEnemy.damage = 100;
    game.enemies.push(superEnemy);
  }

  createSuperCollectable(game) {
    const superCollectable = new Collectable(
      document.getElementById("super_collectable_1")
    );
    superCollectable.value = 100;
    superCollectable.length = 100;
    superCollectable.width = 100;
    superCollectable.healthChangeStep = -10;
    superCollectable.fillStyle = "green";
    this.playDramaticSound();
    game.collectables.push(superCollectable);
  }

  initiliaseNormalSound() {
    this.normalSound = new Audio("../assets/aurora.mp3");
    this.normalSound.addEventListener(
      "ended",
      function () {
        this.currentTime = 0;
        this.play();
      },
      false
    );
  }

  initliaseDramaticSound() {
    this.dramaticSound = new Audio("../assets/punisher.mp3");
    this.dramaticSound.addEventListener(
      "ended",
      function () {
        this.currentTime = 0;
        this.play();
      },
      false
    );
  }

  playNormalSound() {
    if (!this.dramaticSound.paused) {
      this.dramaticSound.pause();
      this.dramaticSound.addEventListener("pause", () => {
        this.normalSound.play();
        this.lastMusic = "normal";
      });
    } else this.normalSound.play();
  }

  playDramaticSound() {
    if (!this.normalSound.paused) {
      this.normalSound.pause();
      this.normalSound.addEventListener("pause", () => {
        this.dramaticSound.play();
        this.lastMusic = "dramatic";
      });
    } else this.dramaticSound.play();
  }
}

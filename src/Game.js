import { InputHandler } from "./Input.js";
import { Menu } from "./Menu.js";
import { GameModeClassic } from "./GameMode.js";

class Game {
  constructor() {
    this.addCanvas();
    this.menu = new Menu(this);
    this.inputHandler = new InputHandler(this);
    window.addEventListener("resize", (e) => {
      this.canvas.setAttribute(
        "height",
        `${window.innerHeight - Math.floor(0.3 * window.innerHeight)}`
      );
      this.canvas.setAttribute(
        "width",
        `${window.innerWidth - Math.floor(0.3 * window.innerHeight)}`
      );
      this.draw(this.canvas.getContext("2d"));
    });

    window.addEventListener("GAME_PAUSED", (e) => {
      this.menu.toggle("GAME PAUSED", ["resume", "restart", "musicControl"]);
      this.paused = !this.paused;
    });
    window.addEventListener("GAME_RESUME", (e) => {
      if (this.state === "running") this.paused = !this.paused;
    });
    window.addEventListener("GAME_RESTART", (e) => {
      this.reset();
    });

    window.addEventListener("GAME_STATE_WON", (e) => {
      this.state = "won";
      setTimeout(() => (this.paused = !this.paused), 100);
      this.menu.toggle("You won", ["restart", "musicControl"]);
    });

    window.addEventListener("MUSIC_PLAY", (e) => {
      this.musicPaused = false;
      this.mode.playNormalSound();
    });

    window.addEventListener("MUSIC_PAUSE", (e) => {
      this.musicPaused = true;
      this.mode.normalSound.pause();
      this.mode.dramaticSound.pause();
    });

    setInterval(() => {
      if (!this.paused) {
        window.dispatchEvent(
          new CustomEvent("TIME_EVENT", { detail: { timeElapsed: 1 / 200 } })
        );
      }
    }, 1000 / 200);
    requestAnimationFrame(this.nextFrame.bind(this));
    this.menu.toggle("Galaxy Surfers", ["start", "musicControl"]);
    this.reset();
    this.paused = true;
  }

  nextFrame() {
    if (!this.paused) {
      this.draw(this.canvas.getContext("2d"));
      this.updateStatusBar();
    }
    requestAnimationFrame(this.nextFrame.bind(this));
  }

  reset() {
    this.state = "running";
    this.paused = false;
    this.pause = null;
    this.player = null;
    this.enemies = null;
    this.collectables = null;
    this.lastScore = null;
    this.environmentEntities = null;
    this.mode = new GameModeClassic(this);
    if (this.musicPaused) {
      this.mode.normalSound.pause();
      this.mode.dramaticSound.pause();
    }
    this.drawMainBoard();
    this.drawStatusBar();
    this.draw(this.canvas.getContext("2d"));
  }

  draw(ctx) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    this.detectCollision();
    this.updateEntitiesArrays();
    this.drawMainBoard(ctx);
    this.player.draw(ctx);
    this.enemies.forEach((enemy) => {
      enemy.draw(ctx);
    });
    this.collectables.forEach((collectable) => {
      collectable.draw(ctx);
    });
    this.environmentEntities.forEach((environmentEntity) => {
      environmentEntity.draw(ctx);
    });
  }

  drawStatusBar() {
    const statusBar = document.createElement("div");
    statusBar.setAttribute("id", "statusBar");
    statusBar.style.position = "absolute";
    statusBar.style.bottom = "0";
    statusBar.style.left = "0";
    statusBar.style.width = "100%";
    statusBar.style.height = "50px";
    statusBar.style.backgroundColor = "black";
    statusBar.style.color = "white";
    statusBar.style.fontSize = "20px";
    statusBar.style.textAlign = "center";
    statusBar.style.paddingTop = "10px";
    statusBar.style.zIndex = "1000";
    statusBar.style.marginTop = "10px";
    statusBar.style.fontFamily = "monospace";
    statusBar.textContent =
      "Score: 0   |   Health: 100   |   Warp Power:Available";
    document.body.appendChild(statusBar);
    this.statusBar = statusBar;
  }

  updateStatusBar() {
    const jumpPower =
      this.player.jumpPower === true ? "Available" : "Not Available";
    this.statusBar.textContent = `Score: ${Math.floor(
      this.score
    )}   |   Health: ${
      Math.floor(this.player.health) >= 0 ? Math.floor(this.player.health) : 0
    }   |   Warp Power:${jumpPower}`;
  }

  updateEntitiesArrays() {
    if (this.player.health <= 0) {
      this.state = "end";
      this.paused = true;
      this.menu.toggle(`You died, score: ${this.score}`, [
        "restart",
        "musicControl",
      ]);
    } else {
      this.enemies = this.enemies.filter((enemy) => enemy.health > 0);
      this.collectables = this.collectables.filter(
        (collectable) => collectable.health > 0
      );
      this.environmentEntities = this.environmentEntities.filter(
        (environmentEntity) => environmentEntity.health > 0
      );
    }
  }

  drawMainBoard(ctx) {
    document.body.style.backgroundColor = "black";
  }

  addCanvas() {
    this.canvas = document.createElement("canvas");
    this.canvas.setAttribute(
      "height",
      `${window.innerHeight - Math.floor(0.3 * window.innerHeight)}`
    );
    this.canvas.setAttribute(
      "width",
      `${window.innerWidth - Math.floor(0.3 * window.innerHeight)}`
    );
    this.canvas.getContext("2d").fillStyle = "#cfcfcf";
    this.canvas
      .getContext("2d")
      .fillRect(0, 0, window.innerWidth, window.innerHeight);
    document.body.appendChild(this.canvas);
  }

  detectCollision() {
    const playerShape = this.player.getPhysicalShapeInfo();
    this.enemies.forEach((enemy) => {
      const enemyShape = enemy.getPhysicalShapeInfo();
      if (playerShape.shape === "RECT" && enemyShape.shape === "RECT") {
        return this.detectRectangleCollision(this.player, enemy, "ENEMY");
      } else {
        console.log("Not implemented");
      }
    });

    this.collectables.forEach((collectable) => {
      const collectableShape = collectable.getPhysicalShapeInfo();
      if (playerShape.shape === "RECT" && collectableShape.shape === "RECT") {
        return this.detectRectangleCollision(
          this.player,
          collectable,
          "COLLECTABLE"
        );
      } else {
        console.log("Not implemented");
      }
    });

    this.environmentEntities.forEach((environmentEntity) => {
      const environmentEntityShape = environmentEntity.getPhysicalShapeInfo();
      if (
        playerShape.shape === "RECT" &&
        environmentEntityShape.shape === "RECT"
      ) {
        return this.detectRectangleCollision(
          this.player,
          environmentEntity,
          "ENVIRONMENT"
        );
      } else {
        console.log("Not implemented");
      }
    });

    return false;
  }

  detectRectangleCollision(player, otherEntity, relationType) {
    const rect1 = player.getPhysicalShapeInfo();
    const rect2 = otherEntity.getPhysicalShapeInfo();
    if (
      rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.length &&
      rect1.y + rect1.length > rect2.y &&
      rect1.shape === "RECT" &&
      rect2.shape === "RECT" &&
      rect1.x >= 0 &&
      rect1.y >= 0 &&
      rect2.x >= 0 &&
      rect2.y >= 0
    ) {
      if (relationType === "COLLECTABLE") {
        this.score += otherEntity.value;
        otherEntity.health = 0;
        window.dispatchEvent(new Event("COLLECTABLE_COLLECTED"));
      } else if (relationType === "ENEMY" && otherEntity.spawnedFully) {
        otherEntity.health = 0;
        player.health = player.health - otherEntity.damage;
      } else if (relationType === "ENVIRONMENT") {
        player.health = player.health - otherEntity.damage;
        player.dx = -player.dx * player.coeffRestitution;
        player.dy = -player.dy * player.coeffRestitution;
      }
      return true;
    } else {
      return false;
    }
  }
}

const game = new Game();

import { MainEntity, Entity } from "./Entity.js";

export class Enemy extends MainEntity {
  constructor(image) {
    super();
    this.fillStyle = "red";
    this.x = Math.random() * 1000;
    this.y = Math.random() * 1000;
    this.length = 60;
    this.width = 60;
    this.health = 100;

    this.dx = 5;
    this.dy = 5;
    this.dx2 = 1;
    this.dy2 = 1;

    this.maxVelocity = 50;
    this.maxAccleration = 30;
    this.mass = 10;
    this.xForce = 300;
    this.yForce = 300;
    this.coeffRestitution = 0.4;
    this.jumpSize = 5;
    setInterval(() => this.ai(), 1000);

    this.health = 100;
    this.healthChangeStep = -10;
    this.damage = 25;
    this.spawnedFully = false;

    setTimeout(() => {
      this.spawnedFully = true;
    }, 1000);

    this.image = image;
    this.playerX = 0;
    this.playerY = 0;

    this.moveRandomly = 0;

    window.addEventListener("PLAYER_POSITION_UPDATE", (event) => {
      this.playerX = event.detail.x;
      this.playerY = event.detail.y;
    });
    window.addEventListener("TIME_EVENT", (e) => {
      this.ai();
      this.updatePhysicalData(e);
    });
  }

  aiWrapper() {
    this.ai();
    setTimeout(() => this.aiWrapper(), 1000);
  }

  ai() {
    if (Math.floor(this.x) - this.width > Math.floor(this.playerX)) {
      this.moveLeft();
    } else if (Math.floor(this.x) + this.width < Math.floor(this.playerX)) {
      this.moveRight();
    } else if (Math.floor(this.y) - this.length > Math.floor(this.playerY)) {
      this.moveDown();
    } else if (Math.floor(this.y) + this.length < Math.floor(this.playerY)) {
      this.moveUp();
    }
  }

  aiRandom() {
    const moves = [37, 39, 38, 40];
    const x = Math.floor(Math.random() * 4);
    if (this.health > 0) {
      switch (moves[x]) {
        case 37:
          this.moveLeft();
          break;
        case 39:
          this.moveRight();
          break;
        case 38:
          this.moveDown();
          break;
        case 40:
          this.moveUp();
          break;
      }
    }
  }
}

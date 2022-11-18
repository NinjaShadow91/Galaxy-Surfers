import { MainEntity } from "./Entity.js";

export class Player extends MainEntity {
  constructor(image) {
    super();
    this.x = 0;
    this.y = 0;
    this.length = 80;
    this.width = 80;
    this.fillStyle = "blue";
    this.health = 100;

    this.dx = 0;
    this.dy = 0;

    this.maxVelocity = 500;
    this.coeffRestitution = 1;
    this.jumpSize = 200;
    this.healthChangeStep = 5;
    this.image = image;
    this.jumpPower = true;
  }

  jump() {
    if (this.jumpPower) {
      if (this.dy) this.y = this.y + Math.sign(this.dy) * this.jumpSize;
      if (this.dx) this.x = this.x + Math.sign(this.dx) * this.jumpSize;
      this.jumpPower = false;
    }
    setTimeout(() => (this.jumpPower = true), 3000);
  }

  updatePhysicalData(e) {
    window.dispatchEvent(
      new CustomEvent("PLAYER_POSITION_UPDATE", {
        detail: { x: this.x, y: this.y },
      })
    );
    super.updatePhysicalData(e);
  }
}

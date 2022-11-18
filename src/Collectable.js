import { Entity } from "./Entity.js";

export class Collectable extends Entity {
  constructor(image) {
    super();
    this.fillStyle = "yellow";
    this.health = 100;
    this.velocity = 0;
    this.healthChangeStep = 0;
    this.accleration = 0;
    this.maxVelocity = 0;
    this.value = 10;
    this.x = Math.random() * 2000;
    this.y = Math.random() * 2000;
    this.length = 40;
    this.width = 40;
    this.image = image;
  }
}

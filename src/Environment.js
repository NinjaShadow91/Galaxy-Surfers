import { Entity } from "./Entity.js";

export class EnvironmentEntity extends Entity {
  constructor(image) {
    super();
    this.health = Infinity;
    this.maxHealth = Infinity;
    this.coeffRestitution = 1;
    this.x = Math.random() * window.innerWidth;
    this.y = Math.random() * window.innerHeight;
    this.length = Math.random() * 500;
    this.width = Math.random() * 10;
    this.image = image;
  }
}

export class Meteor extends EnvironmentEntity {
  constructor(image) {
    super(image);
    this.fillStyle = "red";
    this.y = 0;
    this.health = 100;
    this.length = Math.random() * 100;
    this.width = Math.random() * 100;
    this.width = this.width < 50 ? 50 : this.width;
    this.length = this.length < 50 ? 50 : this.length;
    this.dx = Math.random() * 5 > 2 ? -100 : 100;
    this.dy = 500;
    this.maxVelocity = 800;
    this.dx2 = 50;
    this.dy2 = 50;
    this.healthChangeStep = -130;
    this.damage = 100;
  }
}

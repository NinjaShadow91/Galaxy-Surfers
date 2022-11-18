export class Entity {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.length = 1;
    this.width = 1;
    this.mass = 1;
    this.health = 100;
    this.maxHealth = 100;
    this.fillStyle = "black";

    this.dx = 0;
    this.dy = 0;
    this.dx2 = 0;
    this.dy2 = 0;

    this.image = null;
    this.maxVelocity = 0;
    this.maxAccleration = 0;
    this.xForce = 0;
    this.yForce = 0;
    this.coeffRestitution = 0;
    this.healthChangeStep = 0;
    this.damage = 0;

    window.addEventListener("TIME_EVENT", (e) => {
      this.updatePhysicalData(e);
    });
  }

  updatePhysicalData(e) {
    this.health = this.health + this.healthChangeStep * e.detail.timeElapsed;
    if (this.health > this.maxHealth) this.health = this.maxHealth;
    this.dx = this.dx + this.dx2 * e.detail.timeElapsed;
    if (Math.abs(this.dx) > this.maxVelocity)
      this.dx = this.maxVelocity * Math.sign(this.dx);
    this.dy = this.dy + this.dy2 * e.detail.timeElapsed;
    if (Math.abs(this.dy) > this.maxVelocity)
      this.dy = this.maxVelocity * Math.sign(this.dy);
    this.x = this.x + this.dx * e.detail.timeElapsed;
    this.y = this.y + this.dy * e.detail.timeElapsed;
  }

  draw(ctx) {
    if (this.health > 0) {
      ctx.fillStyle = this.fillStyle;
      if (this.x <= 0 && this.y <= 0) {
        this.x = 0;
        this.y = 0;
      } else if (this.x <= 0 && this.y + this.length >= ctx.canvas.height) {
        this.x = 0;
        this.y = ctx.canvas.height - this.length;
      } else if (this.x + this.width >= ctx.canvas.width && this.y <= 0) {
        this.x = ctx.canvas.width - this.width;
        this.y = 0;
      } else if (
        this.x + this.width >= ctx.canvas.width &&
        this.y + this.length >= ctx.canvas.height
      ) {
        this.x = ctx.canvas.width - this.width;
        this.y = ctx.canvas.height - this.length;
      } else if (this.x <= 0) {
        this.x = 0;
      } else if (this.x + this.width >= ctx.canvas.width) {
        this.x = ctx.canvas.width - this.width;
      } else if (this.y <= 0) {
        this.y = 0;
      } else if (this.y + this.length >= ctx.canvas.height) {
        this.y = ctx.canvas.height - this.length;
      }
      if (this.image) {
        ctx.drawImage(this.image, this.x, this.y, this.length, this.width);
      } else ctx.fillRect(this.x, this.y, this.width, this.length);
    } else {
      this.x = -1;
      this.y = -1;
      window.dispatchEvent(new Event("ENTITY_DIED"));
    }
  }

  moveLeft(time = 1) {
    this.dx2 = (this.dx2 - this.xForce) / this.mass;
    if (Math.abs(this.dx2) > this.maxAccleration)
      this.dx2 = this.maxAccleration * Math.sign(this.dx2);
  }

  moveRight(time = 1) {
    this.dx2 = (this.dx2 + this.xForce) / this.mass;
    if (Math.abs(this.dx2) > this.maxAccleration)
      this.dx2 = this.maxAccleration * Math.sign(this.dx2);
  }

  moveUp(time = 1) {
    this.dy2 = (this.dy2 + this.yForce) / this.mass;
    if (Math.abs(this.dy2) > this.maxAccleration)
      this.dy2 = this.maxAccleration * Math.sign(this.dy2);
  }

  moveDown(time = 1) {
    this.dy2 = (this.dy2 - this.yForce) / this.mass;
    if (Math.abs(this.dy2) > this.maxAccleration)
      this.dy2 = this.maxAccleration * Math.sign(this.dy2);
  }

  getPhysicalShapeInfo() {
    if (this.health > 0)
      return {
        shape: "RECT",
        x: this.x,
        y: this.y,
        length: this.length,
        width: this.width,
      };
    else
      return {
        shape: "RECT",
        x: -1,
        y: -1,
        length: this.length,
        width: this.width,
      };
  }
}

export class MainEntity extends Entity {
  constructor() {
    super();
    this.coeffRestitution = 1;
  }

  updatePhysicalData(e) {
    this.dx2 = 0;
    this.dy2 = 0;
    super.updatePhysicalData(e);
  }

  moveLeft(time = 1) {
    this.dx = -this.maxVelocity;
    this.dy = 0;
  }

  moveRight(time = 1) {
    this.dx = this.maxVelocity;
    this.dy = 0;
  }

  moveUp(time = 1) {
    this.dy = this.maxVelocity;
    this.dx = 0;
  }

  moveDown(time = 1) {
    this.dy = -this.maxVelocity;
    this.dx = 0;
  }
}

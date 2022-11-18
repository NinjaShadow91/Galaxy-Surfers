export class InputHandler {
  constructor(game) {
    window.addEventListener("keydown", (event) => {
      switch (event.key) {
        case "ArrowLeft":
        case "a":
          game.player.moveLeft();
          break;
        case "ArrowRight":
        case "d":
          game.player.moveRight();
          break;
        case "w":
        case "ArrowUp":
          game.player.moveDown();
          break;
        case "s":
        case "ArrowDown":
          game.player.moveUp();
          break;
        case " ":
          game.player.jump();
          break;
        case "Escape":
          game.pause();
      }
    });
  }
}

const MENU_BUTTONS = [
  {
    id: "start",
    text: "Play",
    callback: (menu) => {
      window.dispatchEvent(new Event("GAME_RESTART"));
      menu.toggle();
    },
  },
  {
    id: "resume",
    text: "Resume",
    callback: (menu) => {
      window.dispatchEvent(new Event("GAME_RESUME"));
      menu.toggle();
    },
  },
  {
    id: "restart",
    text: "Restart",
    callback: (menu) => {
      window.dispatchEvent(new Event("GAME_RESTART"));
      menu.toggle();
    },
  },
  {
    id: "musicControl",
    text: "Toggle Music",
    callback: (menu) => {
      if (!menu.musicPause) {
        window.dispatchEvent(new Event("MUSIC_PAUSE"));
      } else {
        window.dispatchEvent(new Event("MUSIC_PLAY"));
      }
      menu.musicPause = !menu.musicPause;
    },
  },
];

export class Menu {
  constructor(game) {
    this.open = false;
    this.musicPause = false;
    this.addMainContainer();
    this.addMenuContainer();
    this.addMainHeadingElement();
    MENU_BUTTONS.forEach((button) => {
      this.addActionButton(button.text, button.id, button.callback);
    });
  }

  addMainContainer() {
    const divContainer = document.createElement("div");
    divContainer.id = "menu";
    divContainer.style.position = "absolute";
    divContainer.style.top = "0px";
    divContainer.style.left = "0px";
    divContainer.style.width = "100%";
    divContainer.style.height = "100%";
    divContainer.style.backgroundColor = "rgba(0,0,0,0.5)";
    divContainer.style.display = "none";
    divContainer.style.justifyContent = "center";
    divContainer.style.alignItems = "center";
    divContainer.style.zIndex = "1000";
    document.body.appendChild(divContainer);
    this.mainContainer = divContainer;
  }

  addMenuContainer() {
    const div = document.createElement("div");
    div.style.margin = "10px";
    div.style.padding = "10px";
    div.style.backgroundColor = "white";
    div.style.borderRadius = "10px";
    div.style.display = "flex";
    div.style.flexDirection = "column";
    div.style.justifyContent = "center";
    div.style.alignItems = "center";
    this.mainContainer.appendChild(div);
    this.menuContainer = div;
  }

  addMainHeadingElement() {
    const h1 = document.createElement("h1");
    h1.style.padding = "10px";
    h1.style.margin = "10px";
    h1.innerText = "Game Paused";
    this.menuContainer.appendChild(h1);
    this.mainHeadingElement = h1;
  }

  addActionButton(text, id, callback) {
    const button = document.createElement("button");
    button.innerText = text;
    button.id = id;
    button.style.margin = "10px";
    button.style.padding = "10px";
    button.style.borderRadius = "10px";
    button.style.backgroundColor = "green";
    button.style.color = "white";
    button.style.fontSize = "20px";
    button.style.cursor = "pointer";
    button.addEventListener("click", () => callback(this));
    this.menuContainer.appendChild(button);
  }

  toggle(message, buttons = MENU_BUTTONS.map((e) => e.id)) {
    this.mainHeadingElement.innerText = message ?? "Game Paused";
    if (this.open) this.hide();
    else this.show(buttons);
    this.open = !this.open;
  }

  show(buttons) {
    Array.from(this.menuContainer.children).forEach((e) => {
      if (e.tagName === "BUTTON" && buttons.includes(e.id)) {
        e.style.display = "block";
      } else if (e.tagName === "BUTTON") {
        e.style.display = "none";
      }
    });
    document.getElementById("menu").style.display = "flex";
  }

  hide() {
    document.getElementById("menu").style.display = "none";
  }
}

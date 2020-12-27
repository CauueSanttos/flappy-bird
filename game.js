window.onload = () => {
  console.log('[Cauê Santos] - Flappy Bird');

  const sprites = new Image();
  sprites.src = './sprites.png';

  const canvas = document.querySelector('canvas');
  const context = canvas.getContext('2d');

  function createFlappyBird() {
    const flappyBird = {
      spriteX: 0,
      spriteY: 0,
      width: 33,
      height: 24,
      x: 10,
      y: 50,
      speed: 0,
      gravity: 0.25,
      jump: 4.6,
      toJump() {
        flappyBird.speed =- flappyBird.jump;
      },
      reload() {
        if (collision(flappyBird, floor)) {
          changeScreen(screens.home);
  
          return;
        }
  
        flappyBird.speed +=  flappyBird.gravity;
        flappyBird.y += flappyBird.speed;
      },
      draw() {
        drawContext(flappyBird);
      }
    }

    return flappyBird;
  }

  function drawContext(itemToDraw, recreateImageX = false) {
    let { x, width } = itemToDraw;

    if (recreateImageX) {
      x += width;
    }

    context.drawImage(
      sprites,
      itemToDraw.spriteX, itemToDraw.spriteY,
      itemToDraw.width, itemToDraw.height,
      x, itemToDraw.y,
      itemToDraw.width, itemToDraw.height
    );
  }

  function collision(itemToCollison, collisionToItem) {
    const itemToCollisonY = itemToCollison.y + itemToCollison.height;
    const collisionToItemY = collisionToItem.y;

    if (itemToCollisonY >= collisionToItemY) {
      return true;
    }

    return false;
  }

  const background = {
    spriteX: 390,
    spriteY: 0,
    width: 275,
    height: 204,
    x: 0,
    y: canvas.height - 204,
    draw() {
      context.fillStyle = '#70C5CE';
      context.fillRect(0, 0, canvas.width, canvas.height);

      drawContext(background);
      drawContext(background, true);
    }
  }

  const floor = {
    spriteX: 0,
    spriteY: 610,
    width: 224,
    height: 112,
    x: 0,
    y: canvas.height - 112,
    draw() {
      drawContext(floor);
      drawContext(floor, true);
    }
  }

  const homeScreen = {
    spriteX: 134,
    spriteY: 0,
    width: 174,
    height: 152,
    x: (canvas.width / 2) - (174 / 2),
    y: 50,
    draw() {
      drawContext(homeScreen);
    }
  }

  const globals = {};

  let activeScreen = {};
  function changeScreen(newScreen) {
    activeScreen = newScreen;

    if (activeScreen.init) {
      activeScreen.init();
    }
  }

  const screens = {
    game: {
      init() {
        globals.flappyBird = createFlappyBird();
      },
      draw() {
        background.draw();
        floor.draw();
        globals.flappyBird.draw();
      },
      reload() {
        globals.flappyBird.reload();
      },
      click() {
        globals.flappyBird.toJump();
      }
    },
    home: {
      draw() {
        screens.game.init();
        screens.game.draw();
        homeScreen.draw();
      },
      reload() {

      },
      click() {
        changeScreen(screens.game);
      }
    },
  };

  function drawGame() {
    activeScreen.reload();
    activeScreen.draw();

    requestAnimationFrame(drawGame);
  }

  this.addEventListener('click', () => {
    if (activeScreen.click) {
      activeScreen.click();
    }
  });

  changeScreen(screens.home);
  drawGame();
}
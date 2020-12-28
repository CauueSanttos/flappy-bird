/**
 * Initialize flappy bird
 */
window.onload = () => {
  console.log('[Cauê Santos] - Flappy Bird');

  /**
   * Created canvas sprite
   */
  const sprites = new Image();
  sprites.src = './assets/img/sprites.png';

  /**
   * Created canvas sounds
   */
  const hitSound = new Audio();
  hitSound.src = './assets/sounds/hit.wav';

  /**
   * Created canvas context
   */
  const canvas = document.querySelector('canvas');
  const context = canvas.getContext('2d');

  /**
   * Global variables in canvas
   */
  const globals = {};

  /**
   * Active screen in canvas
   */
  let activeScreen = {};

  /**
   * Frames canvas
   */
  let frames = 0;

  /**
   * Active click event in screen
   */
  canvas.addEventListener('click', () => {
    if (activeScreen.click) {
      activeScreen.click();
    }
  });

  /**
   * Change active screen and initialize
   * 
   * @param {*} newScreen 
   */
  function changeScreen(newScreen) {
    activeScreen = newScreen;

    if (activeScreen.init) {
      activeScreen.init();
    }
  }

  /**
   * Draw active screen in canvas
   */
  function drawGame() {
    activeScreen.reload();
    activeScreen.draw();

    frames += 1;

    requestAnimationFrame(drawGame);
  }

  /**
   * Create and return new flappy bird object
   */
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
      frame: 0,
      moviments: [
        { spriteX: 0, spriteY: 0 },
        { spriteX: 0, spriteY: 26 },
        { spriteX: 0, spriteY: 52 },
      ],
      toJump() {
        flappyBird.speed =- flappyBird.jump;
      },
      reload() {
        if (collision(flappyBird, globals.floor)) {
          hitSound.play();

          setTimeout(() => {
            changeScreen(screens.home);
          }, 500);

          return;
        }
  
        flappyBird.speed +=  flappyBird.gravity;
        flappyBird.y += flappyBird.speed;
      },
      refreshFrames() {
        const frameInterval = 10;
        const oldInterval = frames % frameInterval === 0;

        if (oldInterval) {
          const incrementBase = 1;
          const increment = incrementBase + flappyBird.frame;
          const repeatBase = flappyBird.moviments.length;

          flappyBird.frame = increment % repeatBase;
        }
      },
      draw() {
        flappyBird.refreshFrames();

        const { spriteX, spriteY } = flappyBird.moviments[flappyBird.frame];

        drawContext({ ...flappyBird, spriteX, spriteY });
      }
    }

    return flappyBird;
  }

  /**
   * Create and return new floor object
   */
  function createFloor() {
    const floor = {
      spriteX: 0,
      spriteY: 610,
      width: 224,
      height: 112,
      x: 0,
      y: canvas.height - 112,
      reload() {
        const floorMoviment = 1;
        const repeat = floor.width / 2;
        const moviment = floor.x - floorMoviment;

        floor.x = moviment % repeat;
      },
      draw() {
        drawContext(floor);
        drawContext(floor, true);
      }
    }

    return floor;
  }

  /**
   * Create and return new pipe object
   */
  function createPipe() {
    const pipe = {
      width: 52,
      height: 400,
      floor: {
        spriteX: 0,
        spriteY: 169,
      },
      sky: {
        spriteX: 52,
        spriteY: 169,
      },
      space: 80,
      pairs: [],
      flappyBirdCollision(pair) {
        const flappyHead = globals.flappyBird.y;
        const flappyBase = globals.flappyBird.y + globals.flappyBird.height;

        if (globals.flappyBird.x >= pair.x) {
          if (flappyHead <= pair.skyPipe.y) {
            return true;
          }

          if (flappyBase >= pair.floorPipe.y) {
            return true;
          }
        }

        return false;
      },
      reload() {
        const old100Frames = frames % 100 === 0;

        if (old100Frames) {
          pipe.pairs.push({
            x: canvas.width,
            y: -150 * (Math.random() + 1),
          });
        }

        pipe.pairs.forEach(pair => {
          pair.x -= 2;

          if (pipe.flappyBirdCollision(pair)) {
            console.log('You lose!');
            changeScreen(screens.home);
          }

          if (pair.x + pipe.width <= 0) {
            pipe.pairs.shift();
          }
        });
      },
      draw() {
        pipe.pairs.forEach(pair => {
          const randonY = pair.y;
          const spacePice = 90;

          const skyPipeX = pair.x;
          const skyPipeY = randonY;

          drawContext({
            ...pipe,
            spriteX: pipe.sky.spriteX,
            spriteY: pipe.sky.spriteY,
            x: skyPipeX,
            y: skyPipeY,
          });

          const floorPipeX = pair.x;
          const floorPipeY = pipe.height + spacePice + randonY;

          drawContext({
            ...pipe,
            spriteX: pipe.floor.spriteX,
            spriteY: pipe.floor.spriteY,
            x: floorPipeX,
            y: floorPipeY,
          });

          pair.skyPipe = {
            x: skyPipeX,
            y: pipe.height + skyPipeY,
          };
          pair.floorPipe = {
            x: floorPipeX,
            y: floorPipeY,
          };
        });
      }
    }

    return pipe;
  }

  /**
   * Detect collision in itens
   * 
   * @param {*} itemToCollison 
   * @param {*} collisionToItem 
   */
  function collision(itemToCollison, collisionToItem) {
    const itemToCollisonY = itemToCollison.y + itemToCollison.height;
    const collisionToItemY = collisionToItem.y;

    if (itemToCollisonY >= collisionToItemY) {
      return true;
    }

    return false;
  }

  /**
   * Draw image in context
   * 
   * @param {*} itemToDraw 
   * @param {*} recreateImageX 
   */
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

  /**
   * Game screens
   */
  const screens = {
    home: {
      init() {
        globals.flappyBird = createFlappyBird();
        globals.floor = createFloor();
        globals.pipe = createPipe();
      },
      draw() {
        background.draw();
        globals.floor.draw();
        globals.flappyBird.draw();        
        homeScreen.draw();
      },
      reload() {
        globals.floor.reload();
      },
      click() {
        changeScreen(screens.game);
      }
    },
    game: {
      draw() {
        background.draw();
        globals.pipe.draw();
        globals.floor.draw();
        globals.flappyBird.draw();
      },
      reload() {
        globals.pipe.reload();
        globals.floor.reload();
        globals.flappyBird.reload();
      },
      click() {
        globals.flappyBird.toJump();
      }
    },
  };

  /**
   * Game home screen 
   */
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

  /**
   * Game background
   */
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

  changeScreen(screens.home);
  drawGame();
}
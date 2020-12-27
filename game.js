window.onload = () => {
  console.log('[Cauê Santos] - Flappy Bird');

  const sprites = new Image();
  sprites.src = './sprites.png';

  const canvas = document.querySelector('canvas');
  const context = canvas.getContext('2d');

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

  const flappyBird = {
    spriteX: 0,
    spriteY: 0,
    width: 33,
    height: 24,
    x: 10,
    y: 50,
    draw() {
      drawContext(flappyBird);
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

  function drawGame() {
    background.draw();
    floor.draw();
    flappyBird.draw();
 
    requestAnimationFrame(drawGame);
  }

  drawGame();
}
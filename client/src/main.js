import Two from 'two.js';

const two = new Two({
  fullscreen: true,
  autostart: true
}).appendTo(document.body);

const displayedDots = [];
const displayedPaths = [];
const computedDots = {};

let currentPlayer = true;
const playerDot = two.makeCircle(0, 0, 5 ,5);
playerDot.fill = '#FCAF58';
playerDot.stroke = '#FF8C42';
playerDot.linewidth = 2;

// Background
let offsetX = 0;
let offsetY = 0;
const navigateBoard = (offsetX, offsetY) => {
  displayedDots.forEach((dot) => {
    if (dot.invalid) {
      dot.visual.fill = '#fff';
    }
    calculatePointPos(dot.visual, dot.x, dot.y, offsetX, offsetY);
  });
  displayedPaths.forEach((path) => {
    calculatePointPos(path.visual, path.x, path.y, offsetX, offsetY);
  })
  // zero.translation.set(16 + offsetX, 16 + offsetY);
  const backgroundXOffset = Math.round(offsetX % 32);
  const backgroundYOffset = Math.round(offsetY % 32);
  document.getElementById('background').style.backgroundPositionX = `${backgroundXOffset}px`;
  document.getElementById('background').style.backgroundPositionY = `${backgroundYOffset}px`;
}
navigateBoard(offsetX, offsetY);

const calculatePointPos = (dot, posX, posY, offsetX, offsetY) => {
  const totalXPos = 16 + offsetX + (posX * 32);
  const totalYPos = 16 + offsetY + (posY * 32);
  dot.translation.set(totalXPos, totalYPos);
}

// Player
let lastMouseX = two.width / 2;
let lastMouseY = two.height / 2;
const calculatePlayerPos = (playerDot, offsetX, offsetY, lastMouseX, lastMouseY) => {
  const xPos = Math.floor((lastMouseX - offsetX) / 32);
  const yPos = Math.floor((lastMouseY - offsetY) / 32);
  calculatePointPos(playerDot, xPos, yPos, offsetX, offsetY);
}
calculatePlayerPos(playerDot, offsetX, offsetY);


document.getElementById('background').addEventListener('mousemove', e => {
  lastMouseX = e.clientX;
  lastMouseY = e.clientY;
  calculatePlayerPos(playerDot, offsetX, offsetY, lastMouseX, lastMouseY);
  // mouse.translation.set(lastMouseX, lastMouseY);
});

document.getElementById('background').addEventListener('mousedown', e => {
  const xPos = Math.floor((lastMouseX - offsetX) / 32);
  const yPos = Math.floor((lastMouseY - offsetY) / 32);

  if (!computedDots[xPos] || !computedDots[xPos][yPos]) {
    let newDotVisual = two.makeCircle(0, 0, 5, 5);
    if (currentPlayer) {
      newDotVisual.fill = '#FCAF58';
      newDotVisual.stroke = '#FF8C42';
      newDotVisual.linewidth = 2;
      playerDot.fill = '#70C2BF';
      playerDot.stroke = '#48A9A6';
      playerDot.linewidth = 2;
    } else {
      newDotVisual.fill = '#70C2BF';
      newDotVisual.stroke = '#48A9A6';
      newDotVisual.linewidth = 2;
      playerDot.fill = '#FCAF58';
      playerDot.stroke = '#FF8C42';
      playerDot.linewidth = 2;
    }
    calculatePointPos(newDotVisual, xPos, yPos, offsetX, offsetY);
    const newDot = {
      x: xPos,
      y: yPos,
      party: currentPlayer ? 0 : 1,
      visual: newDotVisual,
      invalid: false,
    };
    displayedDots.push(newDot);
    if (!computedDots[xPos]) {
      computedDots[xPos] = {};
    }
    computedDots[xPos][yPos] = newDot;
  
    const resultCircle = findCircles(computedDots, newDot);
  
    if (resultCircle && resultCircle.length > 3) {
      invalidateCircled(computedDots, resultCircle);
      const vertices = resultCircle.path.map((routElement) => new Two.Vector((routElement.x - resultCircle.path[0].x) * 32, (routElement.y - resultCircle.path[0].y) * 32));
      var path = new Two.Path(vertices, true, false);
      two.add(path);
      path.stroke = currentPlayer ? '#FF8C42' : '#48A9A6';
      path.fill = 'transparent';
      path.linewidth = 4;
      displayedPaths.push({visual: path, x: resultCircle.path[0].x, y: resultCircle.path[0].y});
      navigateBoard(offsetX, offsetY);
    }
    currentPlayer = !currentPlayer;
  }
});

document.addEventListener("keydown", (e) => {
  let translationY = 0;
  let translationX = 0;
  switch (e.code ) {
    case "ArrowUp":
    case "W":
      translationY += 8;
      break;
    case "ArrowDown":
    case "S":
      translationY -= 8;
      break;
    case "ArrowLeft":
    case "A":
      translationX += 8;
      break;
    case "ArrowRight":
    case "D":
      translationX -= 8;
      break;
  }
  offsetX -= translationX;
  offsetY -= translationY;
  navigateBoard(offsetX, offsetY);
  calculatePlayerPos(playerDot, offsetX, offsetY, lastMouseX, lastMouseY);
});

window.addEventListener("wheel", (e) => {
  let translationY = e.deltaY * 5;
  offsetY += translationY;
  navigateBoard(offsetX, offsetY);
  calculatePlayerPos(playerDot, offsetX, offsetY, lastMouseX, lastMouseY);
}, {passive: true});
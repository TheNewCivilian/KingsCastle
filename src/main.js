import Two from 'two.js';

var two = new Two({
  fullscreen: true,
  autostart: true
}).appendTo(document.body);

const displayedDots = [];
const computedDots = {};

let currentPlayer = true;
var playerDot = two.makeCircle(0, 0, 5 ,5);
var zero = two.makeCircle(0, 0, 5 ,5);
var mouse = two.makeCircle(0, 0, 5 ,5);
const playerOneColor = {
  fill: '#FCAF58',
  stroke: '#FF8C42',
  linewidth: 2,
}
const playerTwoColor = {
  fill: '#70C2BF',
  stroke: '#48A9A6',
  linewidth: 2,
}
// playerDot = {...playerDot, playerOneColor};
playerDot.fill = '#FCAF58';
playerDot.stroke = '#FF8C42';
playerDot.linewidth = 2;

// Background
let offsetX = 0;
let offsetY = 0;
const navigateBoard = (offsetX, offsetY) => {
  displayedDots.forEach((dot) => {
    calculatePointPos(dot.visual, dot.x, dot.y, offsetX, offsetY);
  });
  zero.translation.set(16 + offsetX, 16 + offsetY);
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

const searchForCircle = (computedDots, start, end, heritage, directHeritage) => {
  let longestRouteDots = [];
  for (let xDir = -1; xDir <= 1; xDir += 1) {
    for (let yDir = -1; yDir <= 1; yDir += 1) {

      if (start.x + xDir === end.x && start.y + yDir === end.y && directHeritage !== end) {
        return [start];
      }

      if (
        yDir === 0 && xDir === 0
        || heritage.some(
          (heritagePoint) => start.x + xDir === heritagePoint.x && start.y + yDir === heritagePoint.y
        )
      ) {
        continue;
      }

      if (
        computedDots[start.x + xDir]
        && computedDots[start.x + xDir][start.y + yDir]
        && computedDots[start.x + xDir][start.y + yDir].party === start.party
      ) {
        const result = searchForCircle(computedDots, computedDots[start.x + xDir][start.y + yDir], end, [start, ...heritage], start);
        if (
          result !== null
          && result.length > longestRouteDots
        ) {
          longestRouteDots = result;
        }
      }
      
    }
  }
  if (longestRouteDots.length === 0) {
    return null;
  }
  longestRouteDots = [start, ...longestRouteDots];
  return longestRouteDots;
}


document.getElementById('background').addEventListener('mousemove', e => {
  lastMouseX = e.clientX;
  lastMouseY = e.clientY;
  calculatePlayerPos(playerDot, offsetX, offsetY, lastMouseX, lastMouseY);
  mouse.translation.set(lastMouseX, lastMouseY);
});

document.getElementById('background').addEventListener('mousedown', e => {
  const xPos = Math.floor((lastMouseX - offsetX) / 32);
  const yPos = Math.floor((lastMouseY - offsetY) / 32);
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
  };
  displayedDots.push(newDot);
  if (!computedDots[xPos]) {
    computedDots[xPos] = {};
  }
  computedDots[xPos][yPos] = newDot;
  console.log(searchForCircle(computedDots, newDot, newDot, [], newDot));
  console.log(computedDots);
  currentPlayer = !currentPlayer;
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
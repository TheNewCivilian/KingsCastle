import Two from 'two.js';

var two = new Two({
  fullscreen: true,
  autostart: true
}).appendTo(document.body);

const dots = [];
let currentPlayer = true;
let screenXOffset = 0;
let screenYOffset = 0;


var offsetX = two.width / 2;
var offsetY = two.height / 2;

var playerDot = two.makeCircle(offsetX - 16, offsetY - 16, 5 ,5);
playerDot.fill = '#FCAF58';
playerDot.stroke = '#FF8C42';
playerDot.linewidth = 2;


const recalculateBackground = (offsetX, offsetY) => {
  screenXOffset = offsetX % 32;
  screenYOffset = offsetY % 32;
  document.getElementById('background').style.backgroundPositionX = `${screenXOffset}px`;
  document.getElementById('background').style.backgroundPositionY = `${screenYOffset}px`;
}

recalculateBackground(offsetX, offsetY);


document.getElementById('background').addEventListener('mousemove', e => {
  const xPos = Math.round(e.clientX / 32) * 32 - 16 + screenXOffset;
  const yPos = Math.round(e.clientY / 32) * 32 - 16 + screenYOffset;
  playerDot.translation.set(xPos, yPos);
});

document.getElementById('background').addEventListener('mousedown', e => {
  const xPos = Math.round(e.clientX / 32) * 32 - 16 + screenXOffset;
  const yPos = Math.round(e.clientY / 32) * 32 - 16 + screenYOffset;
  const newDot = two.makeCircle(xPos, yPos, 5, 5);
  if (currentPlayer) {
    newDot.fill = '#FCAF58';
    newDot.stroke = '#FF8C42';
    newDot.linewidth = 2;
    
    playerDot.fill = '#70C2BF';
    playerDot.stroke = '#48A9A6';
    playerDot.linewidth = 2;
  } else {
    newDot.fill = '#70C2BF';
    newDot.stroke = '#48A9A6';
    newDot.linewidth = 2;

    playerDot.fill = '#FCAF58';
    playerDot.stroke = '#FF8C42';
    playerDot.linewidth = 2;
  }
  dots.push(newDot);
  currentPlayer = !currentPlayer;
});

document.addEventListener("keydown", (e) => {
  let translationY = 0;
  let translationX = 0;
  switch (e.code ) {
    case "ArrowUp":
    case "W":
      translationY -= 8;
      break;
    case "ArrowDown":
    case "S":
      translationY += 8;
      break;
    case "ArrowLeft":
    case "A":
      translationX -= 8;
      break;
    case "ArrowRight":
    case "D":
      translationX += 8;
      break;
  }
  dots.forEach((dot) => {
    dot.translation.set(dot.translation.x + translationX, dot.translation.y + translationY);
  });
  playerDot.translation.set(playerDot.translation.x + translationX, playerDot.translation.y + translationY);
  offsetX += translationX;
  offsetY += translationY;
  recalculateBackground(offsetX, offsetY);
});

window.addEventListener("wheel", (e) => {
  let translationY = e.deltaY * 5;
  dots.forEach((dot) => {
    dot.translation.set(dot.translation.x, dot.translation.y + translationY);
  });
  playerDot.translation.set(playerDot.translation.x , playerDot.translation.y + translationY);
  offsetY += translationY;
  recalculateBackground(offsetX, offsetY);
}, {passive: true});
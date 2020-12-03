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

const cicleSearch2 = (computedDots, start, end, heritage) => {
  const idPositions = {
    0: {x: -1, y: -1},
    1: {x: -1, y: 0},
    2: {x: -1, y: 1},
    3: {x: 0, y: 1},
    4: {x: 1, y: 1},
    5: {x: 1, y: 0},
    6: {x: 1, y: -1},
    7: {x: 0, y: -1},
  };
  const positionsId = {
    0: {
      0: 0,
      1: 1,
      2: 2,
    },
    1: {
      0: 7,
      2: 3,
    },
    2: {
      0: 6,
      1: 5,
      2: 4,
    },
   
  };
  let startXOff;
  if (heritage.x < 0) {
    startXOff = 0 - (start.x - heritage.x)
  } else {
    startXOff = heritage.x - start.x
  }
  let startYOff;
  if (heritage.y < 0) {
    startYOff = 0 - (start.y - heritage.y)
  } else {
    startYOff = heritage.y - start.y
  }
  const heritageId = positionsId[startXOff + 1][startYOff + 1];
  for (let startId = (heritageId + 2) % 8; startId !== heritageId; startId = (startId + 1) % 8) {
    const nextXPos = start.x + idPositions[startId].x;
    const nextYPos = start.y + idPositions[startId].y;

    // Found end
    if ( nextXPos === end.x && nextYPos === end.y) {
      return {length: 1, path: [start]};
    }

    if (
      computedDots[nextXPos]
      && computedDots[nextXPos][nextYPos]
      && computedDots[nextXPos][nextYPos].party === start.party
    ) {
      // Seach next right
      const result = cicleSearch2(computedDots, computedDots[nextXPos][nextYPos], end, start);
      if (result) {
        return {length: result.length + 1, path: [start, ...result.path]};
      }
    }
  }
  return null;
}

const startCicleSearch2 = (computedDots, start) => {
  let longestRoute = {length: 0, path: []}
  for (let xDir = -1; xDir <= 1; xDir += 1) {
    for (let yDir = -1; yDir <= 1; yDir += 1) {
      if (yDir === 0 && xDir === 0) continue;

      if (
        computedDots[start.x + xDir]
        && computedDots[start.x + xDir][start.y + yDir]
        && computedDots[start.x + xDir][start.y + yDir].party === start.party
      ) {
        const result = cicleSearch2(computedDots, computedDots[start.x + xDir][start.y + yDir], start, start);
        console.log(result);
        if (result && longestRoute.length < result.length) {
          longestRoute = {length: result.length + 1, path: [start, ...result.path]};
        }
      }
    }
  }
  if (longestRoute.length <= 2) {
    return null;
  }
  return longestRoute;
}

// const searchForCircle = (computedDots, start, end, heritage, directHeritage, route) => {
//   let longestRouteDots = {area: 0, path: []};
//   for (let xDir = -1; xDir <= 1; xDir += 1) {
//     for (let yDir = -1; yDir <= 1; yDir += 1) {
//       const newHeritage = {...heritage};
//       if (!newHeritage[start.x]) {
//         newHeritage[start.x] = {};
//       }
//       newHeritage[start.x][start.y] = start;

//       const newRoute = [...route, start];

//       if (start.x + xDir === end.x && start.y + yDir === end.y && directHeritage !== end) {
//         let area = 0;
//         console.log(Object.keys(newHeritage));
//         console.log(newHeritage);
//         Object.keys(newHeritage).forEach((xSegment) => {
//           let min = Number.MAX_SAFE_INTEGER;
//           let max = 0;
//           Object.keys(newHeritage[xSegment]).forEach((ySegment) => {
//             const ySegmentNumber = parseInt(ySegment);
//             if (ySegmentNumber < min) {
//               min = ySegmentNumber;
//             }
//             if (ySegmentNumber > max) {
//               max = ySegmentNumber;
//             }
//           })
//           // const minYSegment = parseInt(Math.min());
//           // const maxYSegment = parseInt(Math.max(Object.keys(heritage[xSegment])));
//           // console.log(Object.keys(heritage[xSegment]));
//           // console.log(minYSegment);
//           // console.log(maxYSegment);
//           area += max - min + 1;
//         })
//         return { path: newHeritage, area, route: newRoute };
//       }

//       if (
//         yDir === 0 && xDir === 0
//         || (heritage[start.x + xDir] && heritage[start.x + xDir][start.y + yDir])
//       ) {
//         continue;
//       }

//       if (
//         computedDots[start.x + xDir]
//         && computedDots[start.x + xDir][start.y + yDir]
//         && computedDots[start.x + xDir][start.y + yDir].party === start.party
//       ) {
//         const result = searchForCircle(computedDots, computedDots[start.x + xDir][start.y + yDir], end, newHeritage, start, newRoute);
//         if (
//           result !== null
//           && result.area > longestRouteDots.area
//         ) {
//           console.log(result);
//           longestRouteDots = result;
//         }
//       }
      
//     }
//   }
//   if (longestRouteDots.area === 0) {
//     return null;
//   }
//   // longestRouteDots = {...longestRouteDots, path: [start, ...longestRouteDots.path]};
//   return longestRouteDots;
// }


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

  const resultCircle = startCicleSearch2(computedDots, newDot);
  console.log(resultCircle);
  // const longestRouteDots = searchForCircle(computedDots, newDot, newDot, {}, newDot, []);

  if (resultCircle) {
    // const route = [];

    // for ((xSegment) of) {
    //   console.log(xSegment);
    // }
    // Object.keys(resultCircle.path).forEach((xSegment) => {
    //   Object.keys(resultCircle.path[xSegment]).forEach((ySegment) => {
    //     route.push(resultCircle.path[xSegment][ySegment]);
    //   })
    // })
    // .forEach((xSegment) => {
    //   xSegment.forEach((ySegment, value) => {
    //     route.push([value]);
    //   })
    // })

    const vertices = resultCircle.path.map((routElement) => new Two.Vector(routElement.x * 32 + 16, routElement.y * 32 + 16));
    console.log(vertices);
    var path = new Two.Path(vertices, true, false);
    two.add(path);
    path.stroke = '#6dcff6';
    path.linewidth = 2;
  }
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
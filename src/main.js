import Two from 'two.js';

var two = new Two({
  fullscreen: true,
  autostart: true
}).appendTo(document.body);

const displayedDots = [];
const displayedPaths = [];
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
    if (dot.invalid) {
      dot.visual.fill = '#fff';
    }
    calculatePointPos(dot.visual, dot.x, dot.y, offsetX, offsetY);
  });
  displayedPaths.forEach((path) => {
    calculatePointPos(path.visual, path.x, path.y, offsetX, offsetY);
  })
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


const getDotsInvolved = (computedDots, start, dotsInvolved = {}) => {
  if (!dotsInvolved[start.x]) {
    dotsInvolved[start.x] = {};
  }
  dotsInvolved[start.x][start.y] = start;

  let discoveredDots = [];
  let neighborCount = 0;
  for (let xDir = -1; xDir <= 1; xDir += 1) {
    for (let yDir = -1; yDir <= 1; yDir += 1) {
      if (xDir === 0 && yDir === 0) continue;

      const nextXPos = start.x + xDir;
      const nextYPos = start.y + yDir;

      if (
        computedDots[nextXPos]
        && computedDots[nextXPos][nextYPos]
        && computedDots[nextXPos][nextYPos].party === start.party
        && !computedDots[nextXPos][nextYPos].invalid
      ) {
        neighborCount += 1;
        if (!dotsInvolved[nextXPos] || !dotsInvolved[nextXPos][nextYPos]) {
          const furtherSearchResults = getDotsInvolved(computedDots, computedDots[nextXPos][nextYPos], dotsInvolved);
          if (furtherSearchResults.length !== 0) {
            discoveredDots = [...discoveredDots, ...furtherSearchResults];
          }
        }
      }
    }
  }
  if (neighborCount < 2) {
    return [];
  }
  return [start, ...discoveredDots];
}

const listToHashmap = (dotList) => {
  const hashMap = {};
  dotList.forEach((dot) => {
    if (!hashMap[dot.x]) {
      hashMap[dot.x] = {};
    }
    hashMap[dot.x][dot.y] = dot;
  });
  return hashMap;
}

const circleSearch = (computedDots, start, end, heritage) => {
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
  let startId = (heritageId + 2) % 8;
  if (heritageId % 2 === 1) {
    startId = (heritageId + 3) % 8;
  }
  for (; startId !== heritageId; startId = (startId + 1) % 8) {
    const nextXPos = start.x + idPositions[startId].x;
    const nextYPos = start.y + idPositions[startId].y;

    // Found end
    if ( nextXPos === end.x && nextYPos === end.y) {
      // DANGER! startId might not be accurate
      return {length: 1, path: [{...start, in: heritageId, out: startId}]};
    }

    if (
      computedDots[nextXPos]
      && computedDots[nextXPos][nextYPos]
      && computedDots[nextXPos][nextYPos].party === start.party
      && !computedDots[nextXPos][nextYPos].invalid
    ) {
      // Seach next right
      const result = circleSearch(computedDots, computedDots[nextXPos][nextYPos], end, start);
      
      if (result) {
        return {length: result.length + 1, path: [{...start, in: heritageId, out: startId}, ...result.path]};
      }
    }
  }
  return null;
}

const findCircles = (computedDots, start) => {
  // 1. Check if dot has at least 2 neighbors
  let neighborCount = 0;
  for (let xDir = -1; xDir <= 1; xDir += 1) {
    for (let yDir = -1; yDir <= 1; yDir += 1) {
      if (xDir === 0 && yDir === 0) continue;
      const nextXPos = start.x + xDir;
      const nextYPos = start.y + yDir;
      if (
        computedDots[nextXPos]
        && computedDots[nextXPos][nextYPos]
        && computedDots[nextXPos][nextYPos].party === start.party
        && !computedDots[nextXPos][nextYPos].invalid
      ) {
        neighborCount += 1;
      }
    }
  }
  if (neighborCount < 2) {
    return null;
  }

  // 2. discover all connected dots
  const dotsInvolved = listToHashmap(getDotsInvolved(computedDots, start));
  // 3. get starting position
  const firstXSegment = Object.keys(dotsInvolved)[0];
  const firstYSegment = Object.keys(dotsInvolved[firstXSegment]).sort((a, b) => parseInt(a) - parseInt(b))[0];

  // 4. run one circle on border
  const startPoint = dotsInvolved[firstXSegment][firstYSegment];
  return circleSearch(dotsInvolved, startPoint, startPoint, {x: startPoint.x - 1, y: startPoint.y - 1});
}

const isLeft = (direction) => {
  return direction >= 0 && direction <= 2;
}

const isRight = (direction) => {
  return direction >= 4 && direction <= 6;
}

const isTop = (direction) => {
  return direction === 7;
}

// const isBottom = (direction) => {
//   return direction === 3;
// }

const invalidateCircled = (computedDots, resultCircle) => {
  const positionedResultCircle = {};
  resultCircle.path.forEach((point) => {
    if (!positionedResultCircle[point.x]) {
      positionedResultCircle[point.x] = [];
    }
    if (positionedResultCircle[point.x].some((positionedPoint) => point.x === positionedPoint.x && point.y === positionedPoint.y)) {
      positionedResultCircle[point.x].filter((positionedPoint) => !(point.x === positionedPoint.x && point.y === positionedPoint.y));
    } else {
      positionedResultCircle[point.x].push(point);
    }
  });

  Object.keys(positionedResultCircle).forEach((xSegment) => {
    const sortedYSegment = positionedResultCircle[xSegment].sort((a, b) => a.y - b.y);
    // Iterating from top to bottom
    // console.log(sortedYSegment)
    sortedYSegment.forEach((point) => {
      // Ignore if a path node is below
      if (
        (isRight(point.in) && (isLeft(point.out) || isTop(point.out)))
        // || (isLeft(point.in) && isTop(point.out))
        || (isTop(point.in) && isLeft(point.out)) //|| isRight(point.out)))
        
      ) {

        // console.log(point);
        // console.log(positionedResultCircle);
        // console.log(sortedYSegment);
        const pointBeneath = sortedYSegment[sortedYSegment.indexOf(point) + 1];
     
        // invalidate all points / set new between point & pointBeneath
        for (let yPos = point.y + 1; yPos < pointBeneath.y; yPos += 1) {
          // console.log("invalidate");
          // console.log(`${point.x},${yPos}`);

          if (computedDots[point.x]) {
            if (computedDots[point.x][yPos]) {
              computedDots[point.x][yPos].invalid = true;
              continue;
            }
          } else {
            computedDots[point.x] = {};
          }
          // Create point if needed
          let newDotVisual = two.makeCircle(0, 0, 5, 5);
          newDotVisual.fill = '#70C2BF';
          newDotVisual.stroke = '#48A9A6';
          newDotVisual.linewidth = 2;
          const newDot = {
            x: point.x,
            y: yPos,
            party: -1,
            visual: newDotVisual,
            invalid: true,
          };
          computedDots[point.x][yPos] = newDot;
        }
      }
    });
  })
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
  
    if (resultCircle) {
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
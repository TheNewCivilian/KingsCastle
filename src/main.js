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



const pathHasDuplicates = (path) => {
  const tmpPath = [...path];
  while(tmpPath.length > 0) {
    const currentPoint = tmpPath.pop();
    if (tmpPath.find((point) => point.x === currentPoint.x && point.y === currentPoint.y)) {
      return true;
    }
  }
  return false;
}

const circleSearch2 = (computedDots, start, end, heritage) => {
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
      return {length: 1, path: [start]};
    }

    if (
      computedDots[nextXPos]
      && computedDots[nextXPos][nextYPos]
      && computedDots[nextXPos][nextYPos].party === start.party
      && !computedDots[nextXPos][nextYPos].invalid
    ) {
      // Seach next right
      const result = circleSearch2(computedDots, computedDots[nextXPos][nextYPos], end, start);
      
      if (result) {
        const hasDuplicates = pathHasDuplicates(result.path);
        if (!hasDuplicates) {
          return {length: result.length + 1, path: [{...start, in: heritageId, out: startId}, ...result.path]};
        }
      }
    }
  }
  return null;
}


const pathHasDuplicatesStart = (start, path) => {
  const tmpPath = [...path];
  while(tmpPath.length > 0) {
    const currentPoint = tmpPath.pop();
    if (tmpPath.find((point) =>
      point.x === currentPoint.x
      && point.y === currentPoint.y
      && !(start.x === point.x
      && start.y === point.y)
    )) {
      return 1;
    }
  }
  return 0;
}

const findCorrectIndex = (start, route, selectedRoutes) => {
  console.log(start);
  const hasSimilarPoints = selectedRoutes.map((selectedRoute) => pathHasDuplicatesStart(start, [...route.path, ...selectedRoute.path]));
  console.log(hasSimilarPoints);
  const similarIndex = hasSimilarPoints.indexOf(1);
  // console.log(similarIndex);
  if (similarIndex === -1) {
    return selectedRoutes.length;
  }
  if (selectedRoutes[similarIndex].length < route.length) {
    return similarIndex;
  }
  return -1;
}

const startCircleSearch2 = (computedDots, start) => {
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
  const routes = [];
  let longestRoute = {length: 0, path: []}
  for (let xDir = -1; xDir <= 1; xDir += 1) {
    for (let yDir = -1; yDir <= 1; yDir += 1) {
      if (yDir === 0 && xDir === 0) continue;

      const nextXPos = start.x + xDir;
      const nextYPos = start.y + yDir;
      if (
        computedDots[nextXPos]
        && computedDots[nextXPos][nextYPos]
        && computedDots[nextXPos][nextYPos].party === start.party
        && !computedDots[nextXPos][nextYPos].invalid
      ) {
        const result = circleSearch2(computedDots, computedDots[nextXPos][nextYPos], start, start);
        console.log(result);
        if (result) {
          // TODO objects are not identical anymore
          // const hasDuplicates = pathHasDuplicates(result.path); // .some((point, index) => result.path.indexOf(point) !== index);
          // if (!hasDuplicates) {
            const outId = positionsId[xDir + 1][yDir + 1];
            routes.push({length: result.length + 1, path: [{...start, in: -1, out: outId}, ...result.path]});
          // }

          // console.log(hasDuplicates);
          // if (!hasDuplicates && longestRoute.length < result.length + 1) {
          //   const outId = positionsId[xDir + 1][yDir + 1];
          //   longestRoute = {length: result.length + 1, path: [{...start, in: -1, out: outId}, ...result.path]};
          // }
        }
      }
    }
  }
  // if (longestRoute.length <= 2) {
  //   return null;
  // }
  // return longestRoute;

  // Selet routes

  const selectedRoutes = [];
  console.log(routes);
  routes.forEach((route) => {
    const index = findCorrectIndex(start, route, selectedRoutes);
    if (index === -1) {
      return;
    }
    if (index === route.length) {
      selectedRoutes.push(route);
    }
    selectedRoutes[index] = route;
  })
  console.log('out');
  console.log(selectedRoutes);
  return selectedRoutes;
}


// const isLeft = (direction) => {
//   return direction >= 0 && direction <= 2;
// }

// const isRight = (direction) => {
//   return direction >= 4 && direction <= 6;
// }

// const isTop = (direction) => {
//   return direction === 7;
// }

// const isBottom = (direction) => {
//   return direction === 3;
// }

// const invalidateCircled = (computedDots, resultCircle) => {
//   const positionedResultCircle = {};
//   resultCircle.path.forEach((point) => {
//     if (!positionedResultCircle[point.x]) {
//       positionedResultCircle[point.x] = [];
//     }
//     positionedResultCircle[point.x].push(point);
//   });

//   Object.keys(positionedResultCircle).forEach((xSegment) => {
//     const sortedXSegment = positionedResultCircle[xSegment].sort((a, b) => a.y - b.y);
//     sortedXSegment.forEach((point) => {
//       if (isBottom(point.in) || isBottom(point.out) || isLeft(point.in)) return;
//       if ((isLeft(point.in) && isLeft(point.out)) || (isRight(point.in) && isRight(point.out))) return;
//       if ((isRight(point.in) || point.in == -1) && sortedXSegment[sortedXSegment.indexOf(point) + 1]) {

//         const pointBeneath = sortedXSegment[sortedXSegment.indexOf(point) + 1];
//         if (isLeft(pointBeneath.in)) {
//           // invalidate all points / set new between point & pointBeneath
//           for (let yPos = point.y; yPos < pointBeneath.y; yPos += 1) {
            
//             console.log('invalidate');
//             console.log(point.x, yPos)
//             if (computedDots[point.x]) {
//               if (computedDots[point.x][yPos]) {
//                 computedDots[point.x][yPos].invalid = true;
//                 continue;
//               }
//             } else {
//               computedDots[point.x] = {};
//             }
//             // Create point if needed
//             let newDotVisual = two.makeCircle(0, 0, 5, 5);
//             const newDot = {
//               x: point.x,
//               y: yPos,
//               party: -1,
//               visual: newDotVisual,
//               invalid: true,
//             };
//             computedDots[point.x][yPos] = newDot;
//           }
//         }
//       }
//     });
//   })
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
    invalid: false,
  };
  displayedDots.push(newDot);
  if (!computedDots[xPos]) {
    computedDots[xPos] = {};
  }
  computedDots[xPos][yPos] = newDot;

  const resultCircles = startCircleSearch2(computedDots, newDot);
  console.log(resultCircles);
  // const longestRouteDots = searchForCircle(computedDots, newDot, newDot, {}, newDot, []);

  if (resultCircles) {
    // invalidateCircled(computedDots, resultCircle);
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

    // const vertices = resultCircle.path.map((routElement) => new Two.Vector(routElement.x * 32 + 16, routElement.y * 32 + 16));
    // var path = new Two.Path(vertices, true, false);
    // two.add(path);
    // path.stroke = '#6dcff6';
    // path.linewidth = 2;
  }
  // currentPlayer = !currentPlayer;
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
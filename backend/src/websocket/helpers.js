const getUnixTime = () => {
  return Math.ceil(Date.now() / 1000);
}

const randomString = (length = 5) => {
  // Declare all characters
  let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  // Pick characers randomly
  let str = '';
  for (let i = 0; i < length; i++) {
      str += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return str;
};

const hashMapToList = (dotHashMap) => {
  const outList = [];
  Object.keys(dotHashMap).forEach((xPos) => {
    Object.keys(dotHashMap[xPos]).forEach((yPos) => {
      outList.push(dotHashMap[xPos][yPos]);
    })
  })
  return outList;
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

// TODO fix in negative
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
    if (nextXPos === end.x && nextYPos === end.y) {
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


const discoverDotCloud = (computedDots, start, end, dotsInvolved = {}) => {
  if (!dotsInvolved[start.x]) {
    dotsInvolved[start.x] = {};
  }
  let discoveredDots = [];
  let neighborCount = 0;
  dotsInvolved[start.x][start.y] = start;
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
        if ((!dotsInvolved[nextXPos] || !dotsInvolved[nextXPos][nextYPos])) {
          const furtherSearchResults = discoverDotCloud(computedDots, computedDots[nextXPos][nextYPos], end, dotsInvolved);
          if (furtherSearchResults.length !== 0) {
            discoveredDots = [...discoveredDots, ...furtherSearchResults];
          }
        }
      }
    }
  }
  return [{...start, neighborCount } , ...discoveredDots];
}

const reduceDotCloud = (dotCloud) => {
  let removedDots = [];
  const reducedDotCloud = dotCloud.map((dot) => {
    if (dot.neighborCount !== 1) {
      return dot;
    }
    removedDots.push(dot);
    return;
  }).filter((element) => element !== undefined);
  let update = false;
  // update neighborCount
  reducedDotCloud.forEach((cloudElement) => {
    removedDots.forEach((removedDot) => {
      if (
        cloudElement.x - removedDot.x <= 1
        && cloudElement.x - removedDot.x >= -1
        && cloudElement.y - removedDot.y <= 1
        && cloudElement.y - removedDot.y >= -1
      ) {
        cloudElement.neighborCount -= 1;
        update = true;
      }
    });
  });
  
  if (update) {
    return reduceDotCloud(reducedDotCloud);
  }
  return reducedDotCloud;
}

const discoverInvolved3 = (computedDots, start) => {
  const dotCloud = discoverDotCloud(computedDots, start, start);
  return reduceDotCloud(dotCloud);
}

const eliminateDoublePaths = (start, circle) => {
  const outPath = [];
  const tmpList = {};
  const duplicatePoints = circle.path.filter((dot) => {
    if (tmpList[dot.x] && tmpList[dot.x][dot.y]) {
      return true;
    }
    if (!tmpList[dot.x]) {
      tmpList[dot.x] = {};
    }
    tmpList[dot.x][dot.y] = dot;
    return false;
  });
  const startIndex = circle.path.findIndex((dot) => dot.x === start.x && dot.y === start.y);
  if (startIndex === -1) {
    return circle;
  }
  if (duplicatePoints.some((dot) => dot.x === start.x && dot.y === start.y)) {
    return { length: 0, path: [] }
  }
  outPath.push(circle.path[startIndex]);
  for(
    let lastPointIndex = ((startIndex + 1) % circle.path.length);
    lastPointIndex !== startIndex || outPath.length === 0;
    lastPointIndex = ((lastPointIndex + 1) % circle.path.length)
  ) {
    if (duplicatePoints.some((dub) => dub.x === circle.path[lastPointIndex].x && dub.y === circle.path[lastPointIndex].y)) {
      const duplicate = circle.path[lastPointIndex];
      let returningIndex = ((lastPointIndex + 1) % circle.path.length);
      while(!(circle.path[returningIndex].x === duplicate.x && circle.path[returningIndex].y === duplicate.y)) {
        returningIndex = ((returningIndex + 1) % circle.path.length);
      }
      lastPointIndex = returningIndex;
      outPath.push({ ...circle.path[lastPointIndex], in: duplicate.in });
      continue;
    }
    outPath.push(circle.path[lastPointIndex]);
  }
  return { length: outPath.length, path: outPath };
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
  const discoveredDots = discoverInvolved3(computedDots, start);
  const dotsInvolved = listToHashmap(discoveredDots);

  if (Object.keys(dotsInvolved).length <= 0) {
    return null;
  }
  // 3. get starting position
  const firstXSegment = Object.keys(dotsInvolved).sort((a, b) => parseInt(a) - parseInt(b))[0];
  const firstYSegment = Object.keys(dotsInvolved[firstXSegment]).sort((a, b) => parseInt(a) - parseInt(b))[0];

  // 4. run one circle on border
  const startPoint = dotsInvolved[firstXSegment][firstYSegment];
  const circleWithTwowayLines = circleSearch(dotsInvolved, startPoint, startPoint, {x: startPoint.x - 1, y: startPoint.y - 1});
  if (circleWithTwowayLines && circleWithTwowayLines.length > 3) {
    return eliminateDoublePaths(start, circleWithTwowayLines);
  }
  // console.log(circleWithTwowayLines);
  // console.log('result', );
  return circleWithTwowayLines;
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
  let pointsMade = 0;
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

  const sortedXSegmentKeys = Object.keys(positionedResultCircle).sort((a, b) => a - b);
  sortedXSegmentKeys.forEach((xSegment) => {
    const sortedYSegment = positionedResultCircle[xSegment].sort((a, b) => a.y - b.y);
    // Iterating from top to bottom
    sortedYSegment.forEach((point) => {
      // Ignore if a path node is below
      if (
        (isRight(point.in) && (isLeft(point.out) || isTop(point.out)))
        // || (isLeft(point.in) && isTop(point.out))
        || (isTop(point.in) && isLeft(point.out)) //|| isRight(point.out)))
        
      ) {
        const pointBeneath = sortedYSegment[sortedYSegment.indexOf(point) + 1];
     
        // invalidate all points / set new between point & pointBeneath
        for (let yPos = point.y + 1; yPos < pointBeneath.y; yPos += 1) {
          if (computedDots[point.x]) {
            if (computedDots[point.x][yPos]) {
              if (!computedDots[point.x][yPos].invalid && computedDots[point.x][yPos].party !== resultCircle.path[0].party) {
                pointsMade += 1;
              }
              computedDots[point.x][yPos].invalid = true;
              continue;
            }
          } else {
            computedDots[point.x] = {};
          }
          // Create point if needed
          const newDot = {
            x: point.x,
            y: yPos,
            party: -1,
            invalid: true,
          };
          computedDots[point.x][yPos] = newDot;
        }
      }
    });
  })
  return pointsMade;
}

module.exports = {
  findCircles,
  invalidateCircled,
  getUnixTime,
  randomString,
  hashMapToList,
};
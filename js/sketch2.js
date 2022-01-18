function reportWindowSize() {
  const container = document.querySelector('#container')

  resizeCanvas(window.innerWidth / 0.5, window.innerHeight)
}

window.addEventListener('resize', reportWindowSize)

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight, SVG);
  canvas.style('display', 'block');
  canvas.parent('container');
  noLoop();
}

let connections = [];

function connectNearestPoints(points, numberOfPoint) {
  let pointsByDistance = [];
  
  const thisX = points[numberOfPoint][0];
  const thisY = points[numberOfPoint][1];
  for(let j = 0; j < points.length; j++) {

    // points[j] - point(j);
    let distance = dist(thisX, thisY, points[j][0], points[j][1]);
    pointsByDistance.push([j, distance]);
  }
  pointsByDistance.sort((a, b) => a[1] - b[1]);

  pointsByDistance = pointsByDistance.slice(0, 9);

  //for(let j = 0; j < pointsByDistance.length; j++);
  
  for(let j = 1; j < pointsByDistance.length; j++) {
    let pos = pointsByDistance[j][0];
    let c = [thisX, thisY, points[pos][0], points[pos][1]];

    stroke('white');
    strokeWeight(1); 
    line(c[0], c[1], c[2], c[3]);
  }
}

function getDistToNextPoint(x, y, points) {
  let lowestDistance = 100;
  let currDistance = 0;

  for(let i = 0; i < points.length-1; i++) {
    currDistance = dist(x, y, points[i][0], points[i][1]);
    if(lowestDistance > currDistance) lowestDistance = currDistance;
  }
  
  return lowestDistance;
}


function draw() {
  background(200);

  const points = [];

  let rdmNum = Math.round(width / 80);
  console.log('Breite ' + width);
  console.log(rdmNum);
  for(let x = 0; x < rdmNum; x++) {
    for(let y = 0; y < (rdmNum * (height / width)); y++) {
      stroke('pink');
      strokeWeight(1);
      let dist;
      let counter = 0;
      let xCoordinate, yCoordinate;

      do {
        xCoordinate = Math.round(random(-50, width + 50));
        yCoordinate = Math.round(random(-50, height + 50));

        dist = Math.round(getDistToNextPoint(xCoordinate, yCoordinate, points));
        console.log(dist)

        counter++;
        if(counter > 20) dist = 1000;

      } while(dist < 50)

      //if(!dist == 1000) console.log(dist);
      point(xCoordinate, yCoordinate);
      points.push([xCoordinate, yCoordinate]);
    }
  }

  for(let i = 0; i < points.length; i++) {
    connectNearestPoints(points, i)
  }



}

// function windowResized() {
//   resizeCanvas(windowWidth, windowHeight);
//   if(windowHeight > windowWidth){
//     factor = windowHeight;
//     factdiv = 1080;
//   }else{
//     factor = windowWidth;
//     factdiv = 1920;
//   }
// }
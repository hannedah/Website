function reportWindowSize() {
  const container = document.querySelector('#container')

  resizeCanvas(window.innerWidth / 0.5, window.innerHeight)
}

window.addEventListener('resize', reportWindowSize)

let connections = [];

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);
  canvas.style('display', 'block');
  canvas.parent('container');
  noLoop();

}




function connectNearestPoints(points, numberOfPoint) {
  let pointsByDistance = [];
  
  const thisX = points[numberOfPoint][0];
  const thisY = points[numberOfPoint][1];
  for(let j = 0; j < points.length; j++) {
    let distance = dist(thisX, thisY, points[j][0], points[j][1]);
    pointsByDistance.push([j, distance]);
  }
  pointsByDistance.sort((a, b) => a[1] - b[1]);

  pointsByDistance = pointsByDistance.slice(0, 10);

  let pointsConnected = 0;
  
  for(let j = 1; j < pointsByDistance.length; j++) {
    let pos = pointsByDistance[j][0];
    let c = [thisX, thisY, points[pos][0], points[pos][1]];

    
    let connectionChecker = (connections.includes([c[0], c[1], c[2], c[3]]) || connections.includes([c[2], c[3], c[0], c[1]])) ? true : false;
    if(connectionChecker) console.log("YO")
    
    if((!connectionChecker) && pointsConnected <= 5) {
      pointsConnected++;
      stroke('white');
      strokeWeight(1); 
      line(c[0], c[1], c[2], c[3]);
      connections.push([c[0], c[1], c[2], c[3]]);
    }
  }
}



function draw() {
  background(200);

  const points = [];
  for(let x = 0; x < 30; x++) {
    for(let y = 0; y < 20; y++) {
      stroke('white');
      strokeWeight(3); 
      const xCoordinate = Math.round(windowWidth / 30 * x * random(0.7, 1.5));
      const yCoordinate = Math.round(windowHeight / 20 * y * random(0.7, 1.5));
      point(xCoordinate, yCoordinate);
      points.push([xCoordinate, yCoordinate]);
    }
  }

  for(let i = 0; i < points.length; i++) {
    connectNearestPoints(points, i)
  }

}
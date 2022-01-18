function reportWindowSize() {
  const container = document.querySelector('#container')

  resizeCanvas(window.innerWidth / 0.5, window.innerHeight)
}

window.addEventListener('resize', reportWindowSize)
let pointsOrigin = [];
let points = [];


function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);
  canvas.style('display', 'block');
  canvas.parent('container');

  

  
  let dividerX = width / 70;
  let offsetFactor = 0.7 * 0.5;
  
  let blockWidthX = Math.round(width / dividerX);
  let numberBlocksX = Math.round(width / blockWidthX);
  let dividerY = dividerX * (height / width);
  let blockWidthY = Math.round(height / dividerY);
  let numberBlocksY = Math.round(height / blockWidthY);

  console.log('Breite ' + width);
  for(let x = -5; x < numberBlocksX + 5; x++) {
    for(let y = -5; y < numberBlocksY + 5; y++) {
      
        xCoordinate = x * blockWidthX + blockWidthX / 2;
        yCoordinate = y * blockWidthY + blockWidthY / 2;

        let rdmOffset = random(-offsetFactor, offsetFactor) * blockWidthX;
        xCoordinate += rdmOffset;
        rdmOffset = random(-offsetFactor, offsetFactor) * blockWidthY;
        yCoordinate += rdmOffset;

        pointsOrigin.push([xCoordinate, yCoordinate]);

    }
  }

  points = pointsOrigin;
}

let connections = [];

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
  
  for(let j = 1; j < pointsByDistance.length; j++) {
    let pos = pointsByDistance[j][0];
    let c = [thisX, thisY, points[pos][0], points[pos][1]];

    stroke('white');
    strokeWeight(1); 
    line(c[0], c[1], c[2], c[3]);
  }
}

function draw() {
  background(200);
  
  for(let i = 0; i < points.length; i++) {
    let distance=constrain(norm(dist(points[i][0],points[i][1],mouseX,mouseY)/width,0,1),0,1); 
    let factor = lerp(0,1,constrain(map(distance,0,0.5,1,0),0,1));

    points[i][0] = lerp(pointsOrigin[i][0], mouseX, factor);
    points[i][1] = lerp(pointsOrigin[i][1], mouseY, factor);

    connectNearestPoints(points, i);
  }
}
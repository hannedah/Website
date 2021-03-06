function reportWindowSize() {
  const container = document.querySelector('#container')

  resizeCanvas(window.innerWidth / 0.5, window.innerHeight)
}

window.addEventListener('resize', reportWindowSize)

let palette = ["#ff8859", "#56a1c4", "#ee726b", "#ffc5c7", "#fef9c6", "#df5f50", "#f5b800", "#ffcc4d", "#e590b8"];
let simulation;
const nodes = [];
let connections = [];

function setup () {
  const canvas = createCanvas(windowWidth, windowHeight);
  canvas.style('display', 'block');
  canvas.parent('container');


  for (let n = 0; n < 300; n += 1) {
    nodes.push({
      id: n,
      radius: 3,
      x: random(-50, windowWidth + 50),
      y: random(-50, windowHeight + 50),
    });
  }

  nodes[0].fx = windowWidth/2;
  nodes[0].fy = windowHeight/2;
  nodes[0].x = windowWidth/2;
  nodes[0].y = windowHeight/2;


  simulation = d3.forceSimulation(nodes)
    .force('collision', d3.forceCollide().radius(function(d, index) {
      if (index === 0) {
        return 30;
      }
      return d.radius / 2 + 4;
    }))


  ellipseMode(CENTER);

  for (let n = 0; n < nodes.length; n++) {
    findConnections(nodes, n);
  }
}

function findConnections(nodes, numberOfNode) {
  let nodesByDistance = [];
  
  const thisX = nodes[numberOfNode].x;
  const thisY = nodes[numberOfNode].y;
  for(let n = 0; n < nodes.length; n++) {
    let distance = dist(thisX, thisY, nodes[n].x, nodes[n].y);
    if(!(n == 0 || numberOfNode == 0)) nodesByDistance.push([n, distance]);
  }
  nodesByDistance.sort((a, b) => a[1] - b[1]);
  nodesByDistance = nodesByDistance.slice(0, 6);

  
  for(let n = 1; n < nodesByDistance.length; n++) {
    let numberOfConnectedNode = nodesByDistance[n][0];
    let c = [numberOfNode, numberOfConnectedNode];

    let connectionChecker = (connections.includes([c[0], c[1], c[2], c[3]]) || connections.includes([c[2], c[3], c[0], c[1]])) ? true : false;
    
    if((!connectionChecker)) {
      connections.push([numberOfNode, numberOfConnectedNode]);
    }
  }
}

function drawConnections() {
  //stroke(random(palette));
  stroke("#df5f50");
  strokeWeight(1); 

  for(let i = 0; i < connections.length; i++) {
    let c = connections[i];

    if(!(nodes[c[0]].x == nodes[c[0]].oldX && nodes[c[0]].y == nodes[c[0]].oldY)) {
      nodes[c[0]].oldX = nodes[c[0]].x;
      nodes[c[0]].oldY = nodes[c[0]].y;
      line(nodes[c[0]].x, nodes[c[0]].y, nodes[c[1]].x, nodes[c[1]].y);
    }
  }
  //oldConnections = connections.slice();
}

function draw() {
  drawConnections();
  fill('white');
  noStroke();
  for (let n = 1; n < nodes.length; n++) {
    circle(nodes[n].x, nodes[n].y, nodes[n].radius);
  }
  
}

function mouseMoved() {
  nodes[0].fx = mouseX;
  nodes[0].fy = mouseY;
  simulation.alpha(1);
}
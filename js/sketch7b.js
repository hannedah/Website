function reportWindowSize() {
  const container = document.querySelector('#container')

  resizeCanvas(window.innerWidth / 0.5, window.innerHeight)
}

window.addEventListener('resize', reportWindowSize)

let simulation;
const nodes = [];
let connections = [];
 
function setup () {
  const canvas = createCanvas(windowWidth, windowHeight, SVG);
  canvas.style('display', 'block');
  canvas.parent('container');


  for (let n = 0; n < 400; n += 1) {
    nodes.push({
      id: n,
      radius: random(5, 5),
      x: random(-50, windowWidth + 50),
      y: random(-50, windowHeight + 50),
    });
  }

  nodes[0].fx = windowWidth/2;
  nodes[0].fy = windowHeight/2;
  nodes[0].x = windowWidth/2;
  nodes[0].y = windowHeight/2;

  simulation = d3.forceSimulation(nodes)
    .force("charge", d3.forceManyBody().strength(-10)) // positive > everything attracts, negative > everything repells
    .force('collision', d3.forceCollide().radius(function(d, index) {
      if (index === 0) {
        return 40;
      }
      return d.radius / 2 + 5;
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
    let distance = nodesByDistance[n][1];
    let c = [numberOfNode, numberOfConnectedNode];

    let connectionChecker = (connections.includes([c[0], c[1], c[2], c[3]]) || connections.includes([c[2], c[3], c[0], c[1]])) ? true : false;
    
    if((!connectionChecker)) {
      connections.push([numberOfNode, numberOfConnectedNode, distance]);
    }
  }
}

function drawConnections() {
  for(let i = 0; i < connections.length; i++) {
    let c = connections[i];

    let thisX = nodes[c[0]].x, thisY = nodes[c[0]].y, connX = nodes[c[1]].x, connY = nodes[c[1]].y;
    
    if(c[2] < 200) {
      stroke('white');
      strokeWeight(1); 
      line(thisX, thisY, connX, connY);

      c[2] = dist(thisX, thisY, connX, connY);
    }
  }

}

function draw() {
  background(200);
  noStroke();
  fill('red');
  drawConnections();
  for (let n = 1; n < nodes.length; n++) {
    circle(nodes[n].x, nodes[n].y, nodes[n].radius);
  }
  
}

function mouseMoved() {
  nodes[0].fx = mouseX;
  nodes[0].fy = mouseY;
  simulation.alpha(1);
}
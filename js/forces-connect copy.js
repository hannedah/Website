function reportWindowSize() {
  const container = document.querySelector('#container')

  resizeCanvas(window.innerWidth / 0.5, window.innerHeight)
}

window.addEventListener('resize', reportWindowSize)

let simulation;
const nodes = [];
let connections = [];
let oldConnections = [];

function setup () {
  const canvas = createCanvas(windowWidth, windowHeight, SVG);
  canvas.style('display', 'block');
  canvas.parent('container');


  for (let n = 0; n < 300; n += 1) {
    nodes.push({
      id: n,
      radius: random(5, 5),
      x: random(-50, windowWidth + 50),
      y: random(-50, windowHeight + 50),
      oldX: this.x,
      oldY: this.y,
      // fx: 0, // fixed position
      // fy: 0,
    });
  }

  nodes[0].fx = windowWidth/2;
  nodes[0].fy = windowHeight/2;
  nodes[0].x = windowWidth/2;
  nodes[0].y = windowHeight/2;

  const links = [
    {source: 0, target: 1},
    {source: 1, target: 2},
    {source: 2, target: 3}
  ];

  simulation = d3.forceSimulation(nodes)
    //.force("charge", d3.forceManyBody().strength(20)) // positive > everything attracts, negative > everything repells
    //.force("link", d3.forceLink(links).strength(5).distance(5))
    .force('collision', d3.forceCollide().radius(function(d, index) {
      if (index === 0) {
        return 40;
      }
      return d.radius / 2 + 4;
    }))
    //.force("center", d3.forceCenter(windowWidth/2, windowHeight/2));

  ellipseMode(CENTER);

  for (let n = 0; n < nodes.length; n++) {
    findConnections(nodes, n);
  }
  //console.log(nodes);
}

function findConnections(nodes, numberOfNode) {
  let nodesByDistance = [];
  
  const thisX = nodes[numberOfNode].x;
  const thisY = nodes[numberOfNode].y;
  for(let n = 0; n < nodes.length; n++) {
    // nodes[n] - node(n);
    let distance = dist(thisX, thisY, nodes[n].x, nodes[n].y);
    if(!(n == 0 || numberOfNode == 0)) nodesByDistance.push([n, distance]);
  }
  nodesByDistance.sort((a, b) => a[1] - b[1]);
  nodesByDistance = nodesByDistance.slice(0, 10);

  
  for(let n = 1; n < nodesByDistance.length; n++) {
    let numberOfConnectedNode = nodesByDistance[n][0];
    let c = [numberOfNode, numberOfConnectedNode];

    let connectionChecker = (connections.includes([c[0], c[1], c[2], c[3]]) || connections.includes([c[2], c[3], c[0], c[1]])) ? true : false;
    
    if((!connectionChecker)) {
      connections.push([numberOfNode, numberOfConnectedNode]);
      //console.log(connections[n]);
    }
  }
}

function drawConnections() {

  for(let i = 0; i < connections.length; i++) {
    let c = connections[i];

    if(!(nodes[c[0]].x == nodes[c[0]].oldX && nodes[c[0]].y == nodes[c[0]].oldY)) {
      nodes[c[0]].oldX = nodes[c[0]].x;
      nodes[c[0]].oldY = nodes[c[0]].y;

      stroke('red');
      strokeWeight(1); 
      line(nodes[c[0]].x, nodes[c[0]].y, nodes[c[1]].x, nodes[c[1]].y);
    }
  }

  oldConnections = connections.slice();
}

function draw() {

  noStroke();
  fill('blue');
  //for (let n = 1; n < nodes.length; n++) {
    //circle(nodes[n].x, nodes[n].y, nodes[n].radius);
  //}

  drawConnections();
}

function mouseMoved() {
  nodes[0].fx = mouseX;
  nodes[0].fy = mouseY;
  simulation.alpha(1);
}
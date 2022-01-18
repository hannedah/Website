function reportWindowSize() {
  const container = document.querySelector('#container')

  resizeCanvas(window.innerWidth / 0.5, window.innerHeight)
}

window.addEventListener('resize', reportWindowSize)

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
      radius: random(5, 5),
      x: random(0, windowWidth),
      y: random(0, windowHeight)
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
    //.force("charge", d3.forceManyBody().strength(20))
    //.force("link", d3.forceLink(links).strength(5).distance(5))
    .force('collision', d3.forceCollide().radius(function(d, index) {
      if (index === 0) {
        return 40;
      }
      return d.radius / 2 + 4;
    }))
    //.force("center", d3.forceCenter(windowWidth/2, windowHeight/2));

  ellipseMode(CENTER);
}

function connectNearestNodes(nodes, numberOfNode) {
  let nodesByDistance = [];
  
  const thisX = nodes[numberOfNode][0];
  const thisY = nodes[numberOfNode][1];
  for(let n = 0; n < nodes.length; n++) {

    // nodes[n] - node(n);
    let distance = dist(thisX, thisY, nodes[n][0], nodes[n][1]);
    nodesByDistance.push([n, distance]);
  }
  nodesByDistance.sort((a, b) => a[1] - b[1]);

  nodesByDistance = nodesByDistance.slice(0, 10);

  //console.log(nodesByDistance);

  //for(let n = 0; n < nodesByDistance.length; n++);

  let nodesConnected = 0;
  
  for(let n = 1; n < nodesByDistance.length; n++) {
    let pos = nodesByDistance[n][0];
    let c = [thisX, thisY, nodes[pos][0], nodes[pos][1]];

    
    let connectionChecker = (connections.includes([c[0], c[1], c[2], c[3]]) || connections.includes([c[2], c[3], c[0], c[1]])) ? true : false;
    if(connectionChecker) console.log("test")
    //console.log(connectionChecker);
    
    if((!connectionChecker) && nodesConnected <= 5) {
      nodesConnected++;
      stroke('red');
      strokeWeight(1); 
      line(c[0], c[1], c[2], c[3]);
      connections.push([c[0], c[1], c[2], c[3]]);
      
    }
  }
}

function draw() {
  background(200);
  noStroke();
  fill('blue');
  for (let n = 0; n < nodes.length; n++) {
    circle(nodes[n].x, nodes[n].y, nodes[n].radius);
    //connectNearestNodes(nodes, n);
  }
}

function mouseMoved() {
  nodes[0].fx = mouseX;
  nodes[0].fy = mouseY;
  simulation.alpha(1);
}
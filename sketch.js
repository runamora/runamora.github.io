let bck=0;

function setup() {
  createCanvas(windowWidth, windowHeight); 
}

function draw() {
  background(bck);
  bck = map(mouseX,0,windowWidth,50,205);
}
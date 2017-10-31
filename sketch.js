var capture;
var mic;

function setup() {
  createCanvas(720,400);
  capture = createCapture();
  // capture.hide();
  
  mic = new p5.AudioIn();
  mic.start();
  
  noStroke();
  fill(0);
}

function draw() {
  background(255);
  capture.loadPixels();
  var stepSize = round(map(mic.getLevel(),0,0.5,10,50));
  // var stepSize = 15
  
  for (var y=0;y<capture.width;y+=stepSize){
    for (var x=0;x<capture.height;x+=stepSize){
      // method to load gray pixels
      var i = y * capture.width + x;
      var darkness = (255 - capture.pixels[i*4])/255; //4 elements (c,m,y,k)
      var radius = stepSize * darkness
      ellipse (x,y,radius,radius);
    }
  }
}
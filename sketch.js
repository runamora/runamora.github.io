let r;
let cont=55;
let counter=0;

function setup() {
  createCanvas(windowWidth, 600);
  r=width/25;
}

function draw(){
  
  fill(255, 55);
  strokeWeight(0.022);
  
  push();
  translate((r*2)+11*(noise(counter*0.001)-0.55),
            (r*2)+11*(noise(counter*0.001+111)-0.55));

 
  beginShape();
   for(i=0;i<=PI;i+=0.01){
     vertex(r*cos(i)+cont*
            (noise(i+counter*0.005)-0.55),r*sin(i)+cont*
            (noise(i+counter*0.005)-0.55));
   }
  endShape();
 
  beginShape();  
  for(i=0;i<=PI;i+=0.001){
    vertex(r*cos(-i)+cont*
           (noise(i+counter*0.005)-0.55),r*sin(-i)+cont*
           (noise(i+counter*0.005)-0.55));
  }
  endShape();
  
  stroke(0,
         0-55*noise(counter*0.01),
         0+55*noise(counter*0.01));
  pop();
  
  counter++;
}
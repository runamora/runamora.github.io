{\rtf1\ansi\ansicpg1252\cocoartf2709
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 let r;\
let cont=55;\
let counter=0;\
\
function setup() \{\
  createCanvas(windowWidth, 600);\
  r=width/25;\
\}\
\
function draw()\{\
  \
  fill(255, 55);\
  strokeWeight(0.022);\
  \
  push();\
  translate((r*2)+11*(noise(counter*0.001)-0.55),\
            (r*2)+11*(noise(counter*0.001+111)-0.55));\
\
 \
  beginShape();\
   for(i=0;i<=PI;i+=0.01)\{\
     vertex(r*cos(i)+cont*\
            (noise(i+counter*0.005)-0.55),r*sin(i)+cont*\
            (noise(i+counter*0.005)-0.55));\
   \}\
  endShape();\
 \
  beginShape();  \
  for(i=0;i<=PI;i+=0.001)\{\
    vertex(r*cos(-i)+cont*\
           (noise(i+counter*0.005)-0.55),r*sin(-i)+cont*\
           (noise(i+counter*0.005)-0.55));\
  \}\
  endShape();\
  \
  stroke(0,\
         0-55*noise(counter*0.01),\
         0+55*noise(counter*0.01));\
  pop();\
  \
  counter++;\
\}}
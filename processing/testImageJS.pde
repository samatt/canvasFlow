/**
 * Alpha Mask. 
 * 
 * Loads a "mask" for an image to specify the transparency 
 * in different parts of the image. The two images are blended
 * together using the mask() method of PImage. 
 */

// The next line is needed if running in JavaScript Mode with Processing.js
/* @pjs preload="moonwalk.jpg";  */

PImage img;
PImage imgMask;
int[] maskArray;

void setup() {
  size(640, 360);
  img = loadImage("moonwalk.jpg");
  maskArray = new int[img.width*img.height];
  println(img.width);
  println(img.height);
  for( int i=0; i<img.width; i++){
    for(int j=0; j<img.height; j++){
    
      maskArray[i +j*img.width] = (int)random(100,255);
    }
  }

  img.mask(maskArray);
  imageMode(CENTER);
  
}

void draw() {
  background(0, 102, 153);
  image(img, mouseX, mouseY);
}

void mousePressed(){

for( int i=0; i<img.width; i++){
    for(int j=0; j<img.height; j++){
    
      maskArray[i +j*img.width] = (int)random(100,255);
    }
    img.mask(maskArray);
  }
}


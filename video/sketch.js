

let theShader;
let bgVideo;
let reverb, distortion, panner;
let sound;

function preload(){
  
  sound = loadSound('./assets/beepboop.mp3');
  bgVideo = createVideo('./assets/compressed.mp4');
  bgVideo.volume(0);
  bgVideo.loop();
  

  theShader = loadShader('./assets/uniform.vert', './assets/uniform.frag');

  
}

function setup() {
  reverb = new p5.Reverb();
  distortion = new p5.Distortion()
  panner = new p5.Panner3D();
  sound.disconnect();
  sound.loop();
  
  reverb.process(sound, 3, 2);
  createCanvas(windowWidth, windowHeight, WEBGL);
  bgVideo.position = (0, 0);



}

let duration = 500, currTime = 0;
let offset = 0, limit = 4;

function mousePressed(){
  sound.loop();
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();
}

function draw() {
  //background(220);
  let exponent = 3;
  let squareSize = 20;
  for (let i = 0; i < width; i += squareSize) {
    let numSquares = floor(pow(random(0, 1), exponent) * 4);
    for (let j = 0; j < numSquares; j++) {
      let x = i + (random(0, 1) * squareSize) - width/2;
      let y = (height - (numSquares * squareSize)) + (j * squareSize) - height/2;
      fill(random(255), random(255), random(255));
      rect(x, y, squareSize, squareSize);
    }
  }


  currTime++;
  
  // shader(theShader);


  // //const percentageY = map(mouseY, - height/2, height/2, 0, 1);
  // const percentageX = map(mouseX, -width/2, width/2, 0, 1);
  // const rate = lerp(0.9, 1.2, percentageX);
  // sound.rate(rate);

  
  // theShader.setUniform('tex0', bgVideo);

  
  // rect(0,0,width, height);
}
 
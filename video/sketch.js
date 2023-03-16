

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
function draw(){
  
  currTime++;
  
  shader(theShader);


  //const percentageY = map(mouseY, - height/2, height/2, 0, 1);
  const percentageX = map(mouseX, -width/2, width/2, 0, 1);
  const rate = lerp(0.9, 1.2, percentageX);
  sound.rate(rate);

  
  theShader.setUniform('tex0', bgVideo);

  
  rect(0,0,width, height);
}
 
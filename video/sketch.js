let apiKey = "DpGm8WlhgYSGsSj4CgSknHS8EWx2QnRt";

let videos = [];
let images = [];

const queryAdjectives = [
  'dark',
  'unwell',
  'naughty',
  'mad',
  'gross',
  'slimy',
  'sparkly',
  'fuzzy',
  'spiky'
]

const queryNouns = [
  "alien",
  "cat",
  'floppy disk',  
  'computer',
  'hell',
  'demon',
  'monster',
  'robot',
  'cyborg',
  'android',
  'swarm',
  'sheep',
  'particles',

  
]

let imageIndex = 0;
let theShader;
let bgVideo;
let reverb, distortion, panner;
let sound;
let font;
function preload(){
  font = loadFont('./assets/linarc.ttf');
  sound = loadSound('./beepboop.mp3');
  bgVideo = createVideo('./compressed.mp4');
  bgVideo.volume(0);
  bgVideo.loop();
  

  theShader = loadShader('uniform.vert', 'uniform.frag');

  
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

//  getGiphyData();

}

let duration = 500, currTime = 0;
let offset = 0, limit = 4;

function mousePressed(){
  sound.loop();
}
function draw(){
  //background(0);
  currTime++;
  //blendMode(MULTIPLY);
  shader(theShader);


  const percentageY = map(mouseY, - height/2, height/2, 0, 1);
  const percentageX = map(mouseX, -width/2, width/2, 0, 1);
  //distortion.process(sound, lerp(0.4, 0, percentageY), 'none');
  // panner.process(distortion);
  // panner.set(dist(width/2, 0, mouseX, 0), dist(0, height/2, 0, mouseY));

  const rate = lerp(0.9, 1.2, percentageX);
  sound.rate(rate);
  console.log(rate);

  
  theShader.setUniform('tex0', bgVideo);

  
  rect(0,0,width, height);
  textFont(font);
  text(rate, 0, 0);
}
  // if(videos.length > 0){
  //   videos.forEach(video => {      

  //     image(video, 1, 1, width, height);
  //   });
  // }  
  // if (currTime > duration) {
  //   currTime = 0;

  //   if (videos.length > 30){
  //     videos.forEach((item, index) => {
  //       if (index < 10) item.remove();
  //     });
  //   }
    
  //   // videos = [];
  //   //getGiphyData();
  // }
// }

// function getGiphyData() {

  
//   const query1 = queryAdjectives[parseInt(random(queryAdjectives.length))];
  
//   const query2 = queryNouns[parseInt(random(queryNouns.length))];

//   let url = `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${query1 + ' ' + query2}&limit=${limit}`;
//   offset++;
//   loadJSON(url, gotGiphyData);
// }

// function gotGiphyData(data) {
//   images = data.data;
  
//   images.forEach(item => {
//     const video = createVideo(item.images.downsized_small.mp4);
    
//     video.volume(0);
//     video.position(random(width), random(height));
//     video.loop();
//     videos.push(video);
//   });
// }

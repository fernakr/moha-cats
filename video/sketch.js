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

function preload(){
  bgVideo = createVideo('./compressed.mp4');
  bgVideo.volume(0);
  bgVideo.loop();

  theShader = loadShader('uniform.vert', 'uniform.frag');

  
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  bgVideo.position = (0, 0);

//  getGiphyData();

}

let duration = 500, currTime = 0;
let offset = 0, limit = 4;

function draw(){
  //background(0);
  currTime++;
  //blendMode(MULTIPLY);
  shader(theShader);

  theShader.setUniform('tex0', bgVideo);

  
  rect(0,0,width, height);

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
}

function getGiphyData() {

  
  const query1 = queryAdjectives[parseInt(random(queryAdjectives.length))];
  
  const query2 = queryNouns[parseInt(random(queryNouns.length))];

  let url = `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${query1 + ' ' + query2}&limit=${limit}`;
  offset++;
  loadJSON(url, gotGiphyData);
}

function gotGiphyData(data) {
  images = data.data;
  
  images.forEach(item => {
    const video = createVideo(item.images.downsized_small.mp4);
    
    video.volume(0);
    video.position(random(width), random(height));
    video.loop();
    videos.push(video);
  });
}

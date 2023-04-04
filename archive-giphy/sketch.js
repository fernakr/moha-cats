let apiKey = "DpGm8WlhgYSGsSj4CgSknHS8EWx2QnRt";

let videos = [];


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

let boxes = [];


class Box{
  constructor(x, y, w, h){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.color = color(random(255), random(255), random(255));
  }
  
  draw(){
    noStroke();
    fill(this.color);
    const [x,y] = floatPosition(this.x, this.y, -30 * boxes.indexOf(this));
    rect(x, y, this.w, this.h);
    this.x = x;
    this.y = y;
    if (this.x < 0){
      boxes.splice(boxes.indexOf(this), 1);
      boxes.push(new Box(generateRandomPosition(minWidth, maxWidth), random(height), random(100, 200), random(100, 200)));
    }
  }
}

const numBoxes = 20;
let minWidth, maxWidth;
function setup() {
  
  createCanvas(windowWidth, windowHeight);
  minWidth = width * 2/5;
  maxWidth = width;

  getGiphyData();
  for (let i = 0; i < numBoxes; i++){
    boxes.push(new Box(generateRandomPosition(minWidth, maxWidth), random(height), random(100, 200), random(100, 200)));
  }


}

let duration = 150, currTime = 0;
let offset = 0, limit = 15;
let videoLimit = 30;



function draw(){  
  background(255,200);
  currTime++;  
  for (let i = 0; i < boxes.length; i++){
    boxes[i].draw();
  }
  if (currTime > duration){
    getGiphyData();
    currTime = 0;
  }  
  if (videos.length > videoLimit){
    for (let i = 0; i < videos.length - videoLimit; i++){
      videos[i].remove();
      videos.splice(i, 1);
    }
  }
  for (let i = 0; i < videos.length; i++){
    const video = videos[i];
    //const videoEl = video.elt;
    // const x = videoEl.getAttribute('data-x');
    // const y = videoEl.getAttribute('data-y');
    const [ x, y ] = floatPosition(video.x, video.y, - 10 * i)
    video.position(x, y);
  }


}

function floatPosition(x, y, positionOffset = 0){  
  return [x + sin(millis() * .00001 + PI * noise(x, y) + positionOffset), y + sin(millis() * .0002 + PI * noise(x + positionOffset, y))]
}

function generateRandomPosition(minPosition, maxPosition) {
  
  // Set the probability factor for the right side
  let rightFactor = 10;
  
  // Generate a random number between 0 and 1
  let randNum = random();
  
  // Calculate the probability of the position being on the right side
  let rightProb = pow(rightFactor, maxPosition/2 - maxPosition*randNum);
  
  // Generate a random position based on the probability of the right side
  let position = int(random(minPosition, maxPosition, maxPosition*rightProb));
  
  return position;
}


function getGiphyData() {

  
  const query1 = queryAdjectives[parseInt(random(queryAdjectives.length))];
  
  const query2 = queryNouns[parseInt(random(queryNouns.length))];

  let url = `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${query1 + ' ' + query2}&limit=${limit}`;
  offset++;
  loadJSON(url, gotGiphyData);
}

let currHeight = 0;

function gotGiphyData(data) {  
  data.data.forEach(item => {

    // distribute videos across the screen but more concetrated to the right


    const video = createVideo(item.images.downsized_small.mp4);
    
    const x = generateRandomPosition(minWidth, maxWidth);
    currHeight += height/limit;
    if (currHeight > height) currHeight = 0;
    const y = currHeight;    
    video.volume(0);    
    video.position(x, y);
    const size = random(map(x, minWidth, maxWidth, 70, 300), map(x, minWidth, maxWidth, 100, 400));    
    video.size(size, size);
    video.loop();
    // const videoEl = video.elt;
    // videoEl.setAttribute('data-x', x);
    // videoEl.setAttribute('data-y', y);
    videos.push(video);
  });
}
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

function setup() {
  createCanvas(windowWidth, windowHeight);
  getGiphyData();

}

let duration = 100, currTime = 0;
let offset = 0, limit = 10;
let videoLimit = 30;



function draw(){  
  currTime++;  
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
    const videoEl = video.elt;
    const x = videoEl.getAttribute('data-x');
    const y = videoEl.getAttribute('data-y');
    video.position(
      video.x + sin(millis() * .0001 + PI * noise(x, y)), 
      video.y + sin(millis() * .0002 + PI * noise(x, y)));
  }


}

function randomPosition() {
  // Set the maximum range of positions
  let maxPosition = width;
  let minPosition = width/2;
  
  // Set the probability factor for the right side
  let rightFactor = 2;
  
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

function gotGiphyData(data) {  
  data.data.forEach(item => {

    // distribute videos across the screen but more concetrated to the right


    const video = createVideo(item.images.downsized_small.mp4);
    
    const x = randomPosition();
    const y = random(height);
    video.volume(0);    
    video.position(x, y);
    const size = random(100, map(x, width/2, width, 200, 400));    
    video.size(size, size);
    video.loop();
    const videoEl = video.elt;
    videoEl.setAttribute('data-x', x);
    videoEl.setAttribute('data-y', y);
    videos.push(video);
  });
}
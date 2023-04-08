let videos = [];
let images = [];
let videoData;
let imageData;

// change API root url depending on build or dev
//const apiRoot = process.env.NODE_ENV === 'development' ? 'http://localhost:2000' : 'https://moha-cats.herokuapp.com';

//const apiRoot = 'http://localhost:2000';
const apiRoot = 'https://moha-cats.herokuapp.com';




function preload(){
  objectData = loadJSON(apiRoot + '/download');
  
}



function setup() {
  objectData = objectData.objects;
  
  videoData = objectData.filter(item => {    
    const fileExt = item.split('.').pop().toLowerCase();
    return fileExt === 'mov' || fileExt === 'mp4';
  });

  videoData = videoData.map(item => ({
    type: 'video',
    src: item
  }));



  imageData = objectData.filter(item => {
    const fileExt = item.split('.').pop().toLowerCase();
    return fileExt === 'jpg' || fileExt === 'jpeg' || fileExt === 'png';
  });

  imageData = imageData.map(item => ({
    type: 'image',
    src: item
  }));
  

  createCanvas(windowWidth, windowHeight);
  setupObjects();  
}


let duration = 300, currTime = 0;
let offset = 0, limit = 15;
let objectLimit = 30;


let backgroundImage = document.createElement('img');
document.body.appendChild(backgroundImage);
function draw(){    
  currTime++;    
  if (currTime > duration){    
    currTime = 0;        
    setupObjects(null, 5);
  }  
  const items = [...videos, ...images];
  if (items.length > objectLimit){
    for (let i = 0; i < 1; i++){
      const video = videos[i];
      if (video){
        video.elt.remove();
        videos.splice(i, 1);
      }      
    }
    for (let i = 0; i < 5; i++){
      const image = images[i];
      if (image){
        image.elt.remove();
        images.splice(i, 1);
      }      
    }    
  }

  const drawObject = (objects, i,  type) => {    
    const object = objects[i];
    const objectEl = object.elt;
    const x = objectEl.getAttribute('data-x');
    const y = objectEl.getAttribute('data-y');  
    const objectWidth = objectEl.width;
    const objectHeight = objectEl.height;    
    
    
  
    object.position(
      object.x + sin(millis() * .0001 + PI * noise(x, y)), 
      object.y + sin(millis() * .0002 + PI * noise(x, y)));
      if (object.x > width || object.x < 0 - objectWidth || object.y > height || object.y < 0 - objectHeight || object.x < width * 2/5){
        object.elt.remove();
        objects.splice(i, 1);        
        setupObjects(type);
      }
  }

  for (let i = 0; i < videos.length; i++){
    drawObject(videos, i, 'video')
  }
  for (let i = 0; i < images.length; i++){
    drawObject(images, i,  'image')
  }


}

function randomPosition() {
  // Set the maximum range of positions
  let maxPosition = width;
  let minPosition = width * 2/5;
  
  // Set the probability factor for the right side
  let rightFactor = 10;
  
  // Generate a random number between 0 and 1
  let randNum = random();
  
  // Calculate the probability of the position being on the right side
  let rightProb = pow(rightFactor, maxPosition/2 - maxPosition*randNum);
  
  // Generate a random position based on the probability of the right side
  let position = int(random(minPosition, maxPosition, rightProb));
  
  return position;
}


let currHeight = 0;



function setupObjects(type, limit) {    

  //console.log(type);
  let newImages = [], newVideos = [];
  videoData = videoData.sort(() => 0.5 - Math.random());
  imageData = imageData.sort(() => 0.5 - Math.random());
  

  if (type){
    if (type === 'video'){
      newVideos = [videoData[0]];
    }else{
      newImages = [imageData[0]];    
    }    
  }else{

    const videoLimit = limit ? floor(limit * 1/3) : 5;
    const imageLimit = limit ? floor(limit * 2/3) : 10;
    newVideos = videoData.slice(0, videoLimit);
    newImages = imageData.slice(0, imageLimit);
  }

  const items = [...newImages, ...newVideos];

  function positionObject(object){
    const x = randomPosition();    
    currHeight += height/items.length;
    if (currHeight > height) currHeight = 0;
    const y = currHeight;       
    
    
    objectEl.setAttribute('data-x', x);
    objectEl.setAttribute('data-y', y);
    objectEl.setAttribute('data-type', object.type);
    const size = random(map(x, width * 2/5, width, 70, 300), map(x, width * 2/5, width, 100, 400));    

    object.position(x, y);
    object.size(size, size);    
  }

  // console.log(newVideos);
  // console.log(newImages);
  
  newVideos.forEach(videoData => {           
    const video = createVideo(videoData.src);;
    objectEl = video.elt;
    objectEl.muted = true;
    objectEl.autoplay = true;
    objectEl.setAttribute('muted',true);
    objectEl.setAttribute('autoplay',true);
    video.volume(0);   
    video.loop();       
    positionObject(video);
    videos.push(video);
    
  });
  newImages.forEach(imageData => {
    const image = createImg(imageData.src);
    objectEl = image.elt;
    positionObject(image);
    images.push(image)
  });

}
let videos = [];
let images = [];
let videoData;
let imageData;
let currHeight = 0;

// change API root url depending on build or dev
//const apiRoot = process.env.NODE_ENV === 'development' ? 'http://localhost:2000' : 'https://moha-cats.herokuapp.com';

//const apiRoot = 'http://localhost:2000';
const apiRoot = 'https://moha-cats.herokuapp.com';
let chairImage;
let chair;


function preload(){

  const objectStorage = localStorage.getItem('objectStorage');
  const objectStorageExpiration = localStorage.getItem('objectStorageExpiration');
  const now = new Date().getTime();
  const expiration = 1000 * 60 * 60 * 24; // 24 hours

  if(objectStorage && objectStorageExpiration && now < objectStorageExpiration){  
    objectData = JSON.parse(objectStorage);
  } else {
    objectData = loadJSON(apiRoot + '/download', (data) => {
      objectData = data.objects;
      localStorage.setItem('objectStorageExpiration', now + expiration);
      localStorage.setItem('objectStorage', JSON.stringify(objectData));
    });            
  }
  
  chairImage = loadImage('./berry-chair.png');
}



function setup() {  
  
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
  chair = new BerryChair();
}


let duration = 300, currTime = 0;
let offset = 0, limit = 15;
const videoLimit = 5;
const imageLimit = 20;


class BerryChair{
  constructor(){
    const randomFactor = random();

    const imageRatio = chairImage.width / chairImage.height;
    this.width = map(randomFactor, 0, 1, windowWidth/10, windowWidth/5);    
    this.height = this.width / imageRatio;
    this.x = width;
    this.y = 100;    
    this.flip = false;
    this.timer = 0;
    this.active = true;
    this.setDuration(); 
  }  
  setDuration(){
    this.duration = 8000 + random(0, 10000);
    //this.duration = 100;
  }
  draw(){
    // console.log(this.timer);
    // console.log(this.duration);
    if (!this.active){
      this.timer++;
      if (this.timer > this.duration){
        this.active = true;
        this.timer = 0;
      }
    }else{
      background(255,200);
      const xIncrement = this.flip ? 10 : -10;
      this.x = this.x + xIncrement;
      this.y = this.y + 1;
      
      translate(this.x, this.y);
      push();
      
      // Scale -1, 1 means reverse the x axis, keep y the same.
      if (this.flip){            
        scale(-1, 1);
      }
      this.img = image(chairImage, 0, 0, this.width, this.height);
      
      pop();
      
      // flip image
      
  
  
      if (this.x < width/2 - chairImage.width){
        this.flip = true;
        this.x += 300;
  
      }
      if (this.x > width && this.flip){
        this.flip = false;
        this.x = width - 300;
      }
      if (this.y > height){
        this.y = 100;        
        this.x = width;
        this.active = false;
        this.setDuration(this.active);
      }
    }    
  }
}

function draw(){ 
    
  if (chair){
    chair.draw();
  }

  
  currTime++;    
  if (currTime > duration){    
    currTime = 0;        
    
  }  
  //const items = [...videos, ...images];
  if (videos.length > videoLimit){
    for (let i = 0; i < videoLimit - videos.length; i++){
      const video = videos[i];
      if (video){
        video.elt.remove();
        videos.splice(i, 1);
        setupObjects('video');
      }      
    }
  }
  if (images.length > imageLimit){
    for (let i = 0; i < imageLimit - images.length; i++){
      const image = images[i];
      if (image){
        image.elt.remove();
        images.splice(i, 1);
        setupObjects('image');
      }      
    }    
  }

  const drawObject = (objects, i) => {    
    const object = objects[i];
    const objectEl = object.elt;
    const x = objectEl.getAttribute('data-x');
    const y = objectEl.getAttribute('data-y');  
    const type = objectEl.getAttribute('data-type');
    const objectWidth = objectEl.width;
    const objectHeight = objectEl.height;    
    
    
    // toggle class     
    objectEl.classList.add('is-active');

    object.position(
      object.x + sin(millis() * .0001 + PI * noise(x, y)), 
      object.y + sin(millis() * .0002 + PI * noise(x, y)));
      if (object.x > width || object.x < 0 - objectWidth || object.y > height || object.y < 0 - objectHeight || object.x < width / 2 - objectWidth){
        objects.splice(i, 1);                       
        objectEl.remove();
        setupObjects(type);
        //objectEl.remove();        
      }
  }

  for (let i = 0; i < videos.length; i++){
    drawObject(videos, i)
  }
  for (let i = 0; i < images.length; i++){
    drawObject(images, i)
  }

  // const dying = document.querySelectorAll('[data-death]');
  // const deathDuration = 50;
  // if (dying.length > 0){       
  //   dying.forEach(item => {

  //     console.log(item.getAttribute('data-death'));
  //     let deathTime = parseInt(item.getAttribute('data-death'));
  //     //console.log(deathTime);
  //     // console.log(deathTime);
  //     // console.log(deathDuration);
  //     const type = item.getAttribute('data-type');
  //     if (deathTime < deathDuration){
  //       deathTime+= 1;
  //       console.log(deathTime);
  //       item.setAttribute('data-death', deathTime);
  //     }else{    
  //       const objects = type === 'video' ? videos : images;  
  //       const findIndex = objects.findIndex(obj => obj.elt === item);  
        
  //       objects.splice(findIndex, 1);                       
  //       item.remove();
  //       setupObjects(type);
  //     }
  //   })
  // }


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
    const imageLimit = limit ? floor(limit * 2/3) : 20;
    newVideos = videoData.slice(0, videoLimit);
    newImages = imageData.slice(0, imageLimit);
  }


  function positionObject(object, type){
    const x = randomPosition();    
    currHeight += height/4;
    if (currHeight > height) currHeight = 0;
    const y = currHeight;       
    
    
    objectEl.setAttribute('data-x', x);
    objectEl.setAttribute('data-y', y);
    objectEl.setAttribute('data-type', type);
    const size = random(map(x, width * 2/5, width, windowWidth/10, windowWidth/6), map(x, width * 2/5, width, windowHeight/20, windowHeight/6));    

    // const opacity = map(random, 0, 1, 0.5, 1)
    // objectEl.style.opacity(opacity);
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
    positionObject(video, 'video');
    videos.push(video);
    
  });
  newImages.forEach(imageData => {
    const image = createImg(imageData.src);
    objectEl = image.elt;
    positionObject(image, 'image');
    images.push(image)
  });

}
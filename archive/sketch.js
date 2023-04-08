let objects = [];
let objectData;

// change API root url depending on build or dev
//const apiRoot = process.env.NODE_ENV === 'development' ? 'http://localhost:2000' : 'https://moha-cats.herokuapp.com';

//const apiRoot = 'http://localhost:2000';
const apiRoot = 'https://moha-cats.herokuapp.com';




function preload(){
  objectData = loadJSON(apiRoot + '/download');
  
}



function setup() {
  objectData = objectData.objects;
  
  let videos = objectData.filter(item => {    
    const fileExt = item.split('.').pop().toLowerCase();
    return fileExt === 'mov' || fileExt === 'mp4';
  });

  videos = videos.map(item => ({
    type: 'video',
    src: item
  }));



  let images = objectData.filter(item => {
    const fileExt = item.split('.').pop().toLowerCase();
    return fileExt === 'jpg' || fileExt === 'jpeg' || fileExt === 'png';
  });

  images = images.map(item => ({
    type: 'image',
    src: item
  }));

  objectData = [...videos, ...images];

  createCanvas(windowWidth, windowHeight);
  setupObjects(objectData);
  //getGiphyData();

}

//let duration = 400, currTime = 0;
//let offset = 0, limit = 15;
//let objectLimit = 20;



function draw(){  
  // currTime++;    
  // if (currTime > duration){    
  //   currTime = 0;        
  //   //setupObjects(objectData);
  // }  
  // if (objects.length > objectLimit){
  //   for (let i = 0; i < objects.length - objectLimit; i++){
  //     objects[i].elt.remove();
  //     objects.splice(i, 1);
  //   }
  // }

  for (let i = 0; i < objects.length; i++){
    const object = objects[i];
    const objectEl = object.elt;
    const x = objectEl.getAttribute('data-x');
    const y = objectEl.getAttribute('data-y');
    const objectType = objectEl.getAttribute('data-type');
    const objectWidth = objectEl.width;
    const objectHeight = objectEl.height;    
    object.position(
      object.x + sin(millis() * .0001 + PI * noise(x, y)), 
      object.y + sin(millis() * .0002 + PI * noise(x, y)));
      if (object.x > width || object.x < 0 - objectWidth || object.y > height || object.y < 0 - objectHeight){
        object.elt.remove();
        objects.splice(i, 1);        
        setupObjects([objectData.filter(object => object.type === objectType).sort(() => 0.5 - Math.random())[0]])
      }
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


// function getGiphyData() {

  
//   const query1 = queryAdjectives[parseInt(random(queryAdjectives.length))];
  
//   const query2 = queryNouns[parseInt(random(queryNouns.length))];

//   let url = `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${query1 + ' ' + query2}&limit=${limit}`;
//   offset++;
//   loadJSON(url, gotGiphyData);
// }

let currHeight = 0;

function setupObjects(items) {  
//  console.log(items);
  


  let videos = items.filter(item => item.type === 'video');
  let images = items.filter(item => item.type === 'image');

  // grab 3 videos and 3 images
  items = videos.slice(0, 3).concat(images.slice(0, 20));  

  items.sort(() => 0.5 - Math.random());
  //console.log(items);
  
  items.forEach(item => {        
    const x = randomPosition();
    let object;
    currHeight += height/items.length;
    if (currHeight > height) currHeight = 0;
    const y = currHeight;       
    
    
    if (item.type === 'video') {
      object = createVideo(item.src);;
      objectEl = object.elt;
      objectEl.muted = true;
      objectEl.autoplay = true;
      objectEl.setAttribute('muted',true);
      objectEl.setAttribute('autoplay',true);
      object.volume(0);   
      object.loop();       
    }else{
      object = createImg(item.src);
      objectEl = object.elt;
    }

    
    
    objectEl.setAttribute('data-x', x);
    objectEl.setAttribute('data-y', y);
    objectEl.setAttribute('data-type', item.type);
    const size = random(map(x, width * 2/5, width, 70, 300), map(x, width * 2/5, width, 100, 400));    

    object.position(x, y);
    object.size(size, size);    
    objects.push(object);
    
  });
}
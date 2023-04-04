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
  createCanvas(windowWidth, windowHeight);
  setupObjects(objectData.objects);
  //getGiphyData();

}

let duration = 1000, currTime = 0;
let offset = 0, limit = 15;
let objectLimit = 45;



function draw(){  
  currTime++;  
  //console.log(objects);
  if (currTime > duration){    
    currTime = 0;
    setupObjects(objectData.objects);
  }  
  if (objects.length > objectLimit){
    for (let i = 0; i < objects.length - objectLimit; i++){
      objects[i].remove();
      objects.splice(i, 1);
    }
  }
  for (let i = 0; i < objects.length; i++){
    const object = objects[i];
    const objectEl = object.elt;
    const x = objectEl.getAttribute('data-x');
    const y = objectEl.getAttribute('data-y');
    object.position(
      object.x + sin(millis() * .0001 + PI * noise(x, y)), 
      object.y + sin(millis() * .0002 + PI * noise(x, y)));
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
  //console.log(data);
  // randomize sort
  items.sort(() => 0.5 - Math.random());
  items.forEach(item => {

    // distribute objects across the screen but more concetrated to the right

    
    const fileExt = item.split('.').pop();
    let object;
    //console.log(fileExt);
    switch(fileExt){
      
      case 'mp4':
        object = createVideo(item);
        object.volume(0);   
        object.loop();         
        break;
      case 'jpg':        
        object = createImg(item, 'image');        
        break;
      case 'png':        
        object = createImg(item, 'image');        
        break;        
    }

    //console.log(object);
    const x = randomPosition();
   
    currHeight += height/items.length;
    if (currHeight > height) currHeight = 0;
    const y = currHeight;    
    object.position(x, y);
    const objectEl = object.elt;
    objectEl.setAttribute('data-x', x);
    objectEl.setAttribute('data-y', y);
    const size = random(map(x, width * 2/5, width, 70, 300), map(x, width * 2/5, width, 100, 400));    
    // console.log(size);
    // console.log(x);
    object.size(size, size);
    //console.log(object);
    objects.push(object);
    
    // const objectEl = object.elt;
    // objectEl.setAttribute('data-x', x);
    // objectEl.setAttribute('data-y', y);
  });
}
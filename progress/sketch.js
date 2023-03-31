let progress = 0;

// get duration from query string
let urlParams = new URLSearchParams(window.location.search);
let duration = urlParams.get('duration') || 1; // minutes
let incrementBase;

function setup(){
  createCanvas(windowWidth, windowHeight);
  incrementBase = width / (duration * 60 * 60);
}

let currType;
let currDuration;
let usedTypes = [];

let first = true;
let timeStart = Date.now();
function draw(){
       
  const randomInput2 = random(0, 1);  

  
  if (!currType || currDuration >= currType.duration){  
    currDuration = 0;

    const types = [
      {
        value: 1 + 1.5 * random(0.5, 1),
        probability: 0.55,
        duration: 100 + random(0, 1) * 40
      },
      {
        value: -1 - 1.5 * random(0.5, 1),
        probability: 0.9,
        duration: 50 + random(0, 1) * 70
      },      
      {
        value: 0,
        probability: 1,
        duration: 30 + random(0, 1) * 40
      }
    ];
    
    
    currType = first ? types[0] : types.find(t => randomInput2 < t.probability);    
    //console.log(currType);
    first = false;
    
  }
  currDuration++;  

  const increment = incrementBase * currType.value;


  progress += increment; 
  if (progress < 0) progress = 0;



  background(0);
  fill('green');

  rect(0, 0, progress, height);
  const timeElapsed = Date.now() - timeStart;

  fill('white');
  textSize(100);
  text(timeElapsed/ 1000, width/2, height/2);

  if (progress >= width){
    noLoop();
  }
}
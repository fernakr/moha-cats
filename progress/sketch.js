let sketch = function(p){

  let progress = 0;

  // get duration from query string
  let urlParams = new URLSearchParams(window.location.search);
  let duration = urlParams.get('duration') || 1; // minutes
  let incrementBase;
  let timeElapsed = 0;
  
  const padding = 20;
  p.setup = () => {    
    p.createCanvas(p.windowWidth - 2 * padding, p.windowHeight - padding);    
    incrementBase = p.width / (duration * 60 * 60);
  }
  
  let currType;
  let currDuration;  
  
  let first = true;  
  let p5Paused = true;
  
  p.keyPressed = () => {
    if (p.keyCode === 32){
      p5Paused = !p5Paused;      
      document.body.classList.toggle('is-paused', p5Paused);
    }
    // if key code is left arrow
    if (p.keyCode === 37){
      progress -= 100;
    }
    // if key code is right arrow
    if (p.keyCode === 39){
      progress += 100;
    }
  }
  
  // when window is resized
  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth  - 2 * padding, p.windowHeight - 2 * padding);
  }
  
  p.draw = () => {          
    
    
    const randomInput2 = p.random(0, 1);  
    const currPercentage = progress / p.width;
    const intendedPercentage = timeElapsed / (duration * 60 * 1000);
  
    const percentageDiff = currPercentage - intendedPercentage;
    //console.log(percentageDiff * 20);
    
    if (!currType || currDuration >= currType.duration){  
      currDuration = 0;
  
      const probabilityFactor = p.map(percentageDiff, -0.1, 0.1, 0.2, -0.2)
      let probabilityStart = 0.6 + probabilityFactor;
      const types = [
        {
          value: 1 + 1.5 * p.random(0.5, 1),
          probability: probabilityStart,
          duration: 100 + p.random(0, 1) * 40
        },
        {
          value: -1 - 1.5 * p.random(0.5, 1),
          probability: (1 - probabilityStart) * 2/3 + probabilityStart,
          duration: 50 + p.random(0, 1) * 70
        },      
        {
          value: 0,
          probability: 1,
          duration: 30 + p.random(0, 1) * 40
        }
      ];
      
      
      currType = first ? types[0] : types.find(t => randomInput2 < t.probability);    
      //console.log(currType);
      first = false;
      
    }
    const increment = incrementBase * currType.value;  
    currDuration++;  
  
    
  
  
    if (!p5Paused) {
      progress += increment; 
      timeElapsed = timeElapsed + p.deltaTime;
    }
    if (progress < 0) progress = 0;
  
  
  
    p.background('gray');
    p.fill('green');
  
    p.rect(0, 0, progress, p.height);
  //  const timeElapsed = Date.now() - timeStart;
  
    // fill('white');
    // textSize(100);
    // text(timeElapsed/ 1000, width/2, height/2);
  
    if (progress >= p.width){
      p.noLoop();
    }
  }
}

window.onload = () =>{
  new p5(sketch, 'main');
  // console.log(p5Inst)
}

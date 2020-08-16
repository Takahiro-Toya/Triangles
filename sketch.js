/**
 *  ||| Pattern looping |||
 *
 *  The sketch recursively generates two triangles inside 
 *  its parent triangle. A triangle is composed of three vertices and 
 *  three edges. Based on the key input, the function pickes one of  
 *  those three points, then draw a line that equally divides the 
 *  triangle into two from selected point.
 *
 *  Key Input:
 *    1 - square base pattern
 *    2 - line base patter
 *    3 - looks random but always produces same pattern between 
 *        left and right base triangles
 *    4 - random: the function randomly applies pattern 1 OR 2 OR 3 
 *    C - apply color: changes between all white and random colour
 *    UP ARROW - increase the number of triangles (maximum 512)
 *    DOWN ARROW - decrease the number of triangles (minimum 2)
 *  
 *  Takahiro Toya (n10056513)
 *    The idea comes from triangle mosaic design
 *    The code is 100% my own made
 */

const areaSize = 600
const margin = 0;
const [minDivide, maxDivide] = [2, 10];
let shouldFill = false;
let numDivide = minDivide;
let currentMode = 1;
let triangles = [];

function setup() {
  createCanvas(areaSize, areaSize);
  colorMode(HSB);
}

function draw() {  
  loopComponent();
}

/*
  A set of loop component
 */
function loopComponent() {
  triangles = [];
  createTriangles(currentMode); 
  loop();
  background(100);
  drawTriangles();
  noLoop();
}

/*
  Responsible for drawing all triangles
 */
function drawTriangles() {
  let sat = random(360);
  for(let i=0; i< triangles.length; i++) {
    if (shouldFill) {
      fill(sat, random(50, 100), random(50, 100));
    } else { 
      // no Fill uses white fill 
      fill(360, 0, 100);
    }
    triangle(triangles[i].x1, triangles[i].y1, 
             triangles[i].x2, triangles[i].y2, 
             triangles[i].x3, triangles[i].y3);             
  }
  
}

/*
  Create all triangles
  The parameter seed is set to determine which one of three points
  to be picked to generate children triangles
 */
function createTriangles(seed) {
  // set first two triangles manually
  triangles.push(new Triangle(margin, areaSize - margin, 
                              margin, margin, 
                              areaSize - margin, areaSize - margin));
  triangles.push(new Triangle(areaSize - margin, margin, 
                              areaSize - margin, areaSize - margin, 
                              margin, margin));
  // number of triangles that are generated right before each loop
  // This count should incease exponentially as one triangle produces two triangles inside
  let triCount = 2;
  // loop of how many times we repeat the process of... 
  // "a parent generates two children,
  // and the children produce thier children..."
  for(let i=triCount; i<numDivide; i++) {
    let temp = []
    // process of parents generating children
    // store generated children triangles 
    // in a temporal array to wait all parents finish generating
    for (let j=1; j<=triCount; j++) {
      let generated = triangles[triangles.length - j].generateNew(seed);
      temp.push(generated);
    }
    // Once all parents has finished generating children,
    // it's time to store children into triangles list.
    // In the next loop, these children will be considered as parents
    for(let t=0; t<temp.length; t++){
      for(let u=0; u<temp[t].length; u++){
        triangles.push(temp[t][u]); 
      }     
    }
    // number of triangles increases exponentially.
    triCount = pow(2, i);
  }
  
}

/*
  Triangle object
  Call generateNew function to generate children triangles inside this triangle
 */
function Triangle(x1, y1, x2, y2, x3, y3) {

  this.x1 = x1;
  this.y1 = y1;
  this.x2 = x2;
  this.y2 = y2;
  this.x3 = x3;
  this.y3 = y3;
  
  // seed to determine which one of the triangles points to be used to divide
  this.generateNew = function(seed) {
    let choice = 1;
    // seed value 4 is random
    if (seed === 4) {
      choice = random([1, 2, 3]);
    } else {
      choice = seed 
    }
    // choose (x1, y1), 
    // draw dividing line to the edge (x2, y2) - (x3, y3)
    if (choice === 1) {
      // divide this triangle equally into two 
      // so take center of the edge (x2, y2) - (x3, y3)
      let nx = (x2 + x3) / 2;
      let ny = (y2 + y3) / 2;
      return [new Triangle(nx, ny, x1, y1, x2, y2),
              new Triangle(nx, ny, x1, y1, x3, y3)];
    // choose (x2, y2)
    // draw dividing line to the edge (x1, y1) - (x3, y3)
    } else if (choice === 2){
      let nx = (x1 + x3) / 2;
      let ny = (y1 + y3) / 2;
      return [new Triangle(nx, ny, x2, y2, x1, y1),
              new Triangle(nx, ny, x2, y2, x3, y3)];    
    // choose (x3, y3)
    // draw dividing line to the edge (x2, y2) - (x1, y1)
    } else if (choice === 3){
      let nx = (x2 + x1) / 2;
      let ny = (y2 + y1) / 2;
      return [new Triangle(nx, ny, x3, y3, x2, y2),
              new Triangle(nx, ny, x3, y3, x1, y1)];       
    } 
  } 
}

/*
  Handling key input
 */
function keyPressed() {
  if (key === '1') {
    currentMode = 1;
    loopComponent();
  } else if (key === '2') {
    currentMode = 2;
    loopComponent();
  } else if (key === '3') {
    currentMode = 3;
    loopComponent();
  } else if (key === '4') {
    currentMode = 4;   
    loopComponent();
  // change of color mode: random fill OR white fill
  } else if (key === 'c') {
    shouldFill = !shouldFill;
    loopComponent();
  // increment the number of dividing process (number of triagles)
  } else if (keyCode === DOWN_ARROW) {
    if (numDivide === minDivide) {
      numDivide = minDivide;
    } else {
      numDivide -= 1; 
    }
    loopComponent();
  // decrement the number of dividing process (number of triangles)
  } else if (keyCode === UP_ARROW) {
    if (numDivide === maxDivide) {
      numDivide = maxDivide;
    } else {
      numDivide += 1; 
    }    
    loopComponent();
  } 
}
  
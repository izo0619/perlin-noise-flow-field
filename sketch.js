
var inc=0.1;
var scl =20;
var cols, rows;

var zoff=0;

var fr;

var particles = [];

var flowfield=[];

function setup() {
  createCanvas(1400, 1000);
  cols = floor(width/scl);
  rows=floor(height/scl);
  fr = createP('')
  
  flowfield = new Array(cols,rows);
  
  for (var i = 0;i <500; i++){
    particles[i] = new Particle()
  }
  background(51);
}

function draw() {
  // background(51);
  var yoff = 0;
  var xdir=1
  var ydir=1;
  for (let y = 0; y < rows; y++){
    var xoff = 0;
    for (let x = 0; x < cols; x++){
      if (x < cols/2){
        xdir=-1
      }
      if (y < rows/2){
        ydir=-1
      }
      var index = (x+y*cols);
      var angle = sin(noise(xoff,yoff,zoff)*TWO_PI)+ cos(noise(xoff,yoff,zoff)*TWO_PI);
      var v = p5.Vector.fromAngle(angle);
      v.setMag(1);
      flowfield[index] = v;
      
      xoff+=inc
      // stroke(255, 100);
      // strokeWeight(1);
      // push();
      // translate(x*scl, y*scl);
      // rotate(v.heading());
      // line(0, 0, scl, 0);
      // pop();
    }
    yoff+=inc;
    
    zoff+=0.0003;
  }
  
  
  for (let i = 0; i < particles.length; i++){
    particles[i].follow(flowfield);
    particles[i].update();
    particles[i].edges();
    particles[i].show();
    
  }
  
  // fr.html(floor(frameRate()))
  // fr.html([particles[0].r, particles[0].g, particles[0].b])
  
}

function Particle(){
  this.pos = createVector(random(width),random(height));
  this.vel = createVector(0,0);
  this.acc = createVector(0,0);
  this.maxspeed = 4;
  this.prevPos = this.pos.copy();
  this.r = 255;
  this.g = 255;
  this.b = 255;
  
  this.update = function() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxspeed)
    this.pos.add(this.vel);
    this.acc.mult(0);
  }
  
  this.follow = function(vectors){
    var x = floor(this.pos.x/scl);
    var y = floor(this.pos.y/scl);
    var index = x+y*cols;
    var force = vectors[index];
    this.applyForce(force);
  }
  
  this.applyForce = function(force){
    this.acc.add(force);
  }
  
  this.show = function() {
    stroke(0,250);
    stroke(this.r, this.g, this.b, 55);
    this.r -= 3;
    this.g -= 1;
    this.b -= 1;
    if (this.r < 100) {
      this.r = 255;
    }
    if (this.g < 100) {
      this.g = 255;
    }
    if (this.b < 100) {
      this.b = 255;
    }
    strokeWeight(.4);
    line(this.pos.x, this.pos.y, this.prevPos.x, this.prevPos.y)
    this.updatePrev()
    // point(this.pos.x, this.pos.y)
  }
  
  this.updatePrev = function(){
    this.prevPos.x= this.pos.x;
    this.prevPos.y= this.pos.y;
  }
  
  this.edges = function(){
    if (this.pos.x > width) {
      this.pos.x=0;
      this.updatePrev();
    }
    if (this.pos.x < 0) {
      this.pos.x=width;
      this.updatePrev();
    }
    if (this.pos.y > height) {
      this.pos.y=0;
      this.updatePrev();
    }
    if (this.pos.y < 0) {
      this.pos.y=height;
      this.updatePrev();
    }
  }
}


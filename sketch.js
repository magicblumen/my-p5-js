// todos los caminos
let paths = [];
let painting = false;
let next = 0;
let current;
let previous;

let colors = [
 // [255, 0, 0],  // Rojo
  [0, 255, 0],  // Verde
  [700, 0, 255],  // Azul
 // [255, 255, 0], // Amarillo
 // [255, 0, 255], // Magenta
  [0, 0, 255]  // Cian
];

function setup() {
  createCanvas(720, 400);
  current = createVector(10, 990);
  previous = createVector(800, 0);
}

function draw() {
  background(880, 90, 8);

  if (millis() > next && painting) {

    current.x = mouseX;
    current.y = mouseY;

    let force = p5.Vector.sub(current, previous);
    force.mult(0.220);

    paths[paths.length - 1].add(current, force);

    next = millis() + random(5);

    previous.x = current.x;
    previous.y = current.y;
  }

  for (let i = 0; i < paths.length; i++) {
    paths[i].update();
    paths[i].display();
  }
}

function mousePressed() {
  next = 0;
  painting = true;
  previous.x = mouseX;
  previous.y = mouseY;
  let color = random(colors);
  paths.push(new Path(color));
  // Increase particle size when mouse is pressed
  for (let i = 0; i < paths.length; i++) {
    for (let j = 0; j < paths[i].particles.length; j++) {
      paths[i].particles[j].size += 5; // Adjust the increment as needed
    }
  }
}

function mouseReleased() {
  painting = false;
}

class Path {
  constructor(color) {
    this.particles = [];
    this.color = color;
  }

  add(position, force) {
    this.particles.push(new Particle(position, force, this.color));
  }

  update() {
    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].update();
    }
  }

  display() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      if (this.particles[i].lifespan <= 0) {
        this.particles.splice(i, 1);
      } else {
        this.particles[i].display(this.particles[i + 1]);
      }
    }
  }
}

class Particle {
  constructor(position, force, color) {
    this.position = createVector(position.x, position.y);
    this.velocity = createVector(force.x, force.y);
    this.drag = 0.95;
    this.lifespan = 255;
    this.color = color;
    this.gravity = createVector(0, -0.2); // Reverse gravity (pointing upwards)
    this.size = 8; // Initial size of the particle
  }

  update() {
    this.velocity.add(this.gravity);
    this.position.add(this.velocity);
    this.velocity.mult(this.drag);
    this.lifespan--;
    this.size += 0.1; // Increase size
  }

  display(other) {
    let [r, g, b] = this.color;
    stroke(r, g, b, this.lifespan);
    fill(r, g, b, this.lifespan / 2);
    ellipse(this.position.x, this.position.y, this.size, this.size);
    if (other) {
      line(this.position.x, this.position.y, other.position.x, other.position.y);
    }
  }
}

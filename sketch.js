let N = 80;
let size = (N + 2) * (N + 2);
let iter = 20;
// empty arrays for velocity
let u = new Array(size).fill(0.0);
let v = new Array(size).fill(0.0);
let u_prev = new Array(size).fill(0.0);
let v_prev = new Array(size).fill(0.0);
// empty arrays for density
let dens = new Array(size).fill(0.0);
let dens_prev = new Array(size).fill(0.0);

let source = 5;
var diff = 0.0001;
var visc = 0.0001;
var dt = 0.01;

function setup() {
  createCanvas(512, 512);
  background(0);
}

function draw() {
  add_density();
  add_velocity();
  vel_step(N, u, v, u_prev, v_prev, visc, dt);
  dens_step(N, dens, dens_prev, u, v, diff, dt);
  renderD();
  // renderD_high();
  fade();
}
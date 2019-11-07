// 2D to 1D, for efficiency purposes
function IX(x, y) {
  return x + y * (N + 2);
}

function PX(x, y) {
  return (x + width * y) * 4;
}

// physical length of each side of the grid is
// one so that the grid spacing is given by
// h=1/N

// The basic structure of our solver is as follows. 
// We start with some initial state for the velocity 
// and the density and then update its values 
// according to events happening in the environment.

// FORCES will set the fluid into motion while
// SOURCES will inject densities into the environment

// We start from am initial density and then repeatedly
// resolve these three terms over each time step


// DENSITY SOLVER ***************************************
// diffusing without 'k' wwill blowup the code, see paper for more info
function diffuse(N, b, x, x0, diff, dt) {
  let a = dt * diff * N * N;
  for(let k = 0; k < iter; k++){
    for(let i = 1; i <= N; i++){
      for(let j = 1; j <= N; j++){
        x[IX(i,j)] = (x0[IX(i,j)] + a * (x[IX(i-1,j)] + x[IX(i+1,j)] + x[IX(i,j-1)] + x[IX(i,j+1)])) / (1 + 4 * a);
      }
    }
    set_bnd(N, b, x);
  }
}

function advect(N, b, d, d0, u, v, dt) {
  let i0, j0, i1, j1, x, y, s0, t0, s1, t1;
  let dt0 = dt * N;
  for(let i = 0; i <= N; i++){
    for(let j = 0; j <= N; j++){
      x = i - dt0 * u[IX(i,j)];
      y = j - dt0 * v[IX(i,j)];
      if(x < 0.5) x = 0.5;
      if(x > N + 0.5) x = N + 0.5;
      i0 = int(x);
      i1 = i0 + 1;
      if(y < 0.5) y = 0.5;
      if(y > N + 0.5) y = N + 0.5;
      j0 = int(y);
      j1 = j0 + 1;

      s1 = x - i0; s0 = 1 - s1; t1 = y - j0; t0 = 1 - t1;
      d[IX(i,j)] = s0 * (t0 * d0[IX(i0,j0)] + t1 * d0[IX(i0,j1)]) + s1 * (t0 * d0[IX(i1,j0)] + t1 * d0[IX(i1,j1)]);
    }
  }
  set_bnd(N, b, d);
}

function dens_step(N, x, x0, u, v, diff, dt) {
  diffuse(N, 0, x0, x, diff, dt);
  advect(N, 0, x, x0, u, v, dt);
}
// DENSITY SOLVER ***************************************

// VELOCITY SOLVER ***************************************
function vel_step(N, u, v, u0, v0, visc, dt){
  diffuse(N, 1, u0, u, visc, dt);
  diffuse(N, 2, v0, v, visc, dt);
  project(N, u0, v0, u, v);
  advect(N, 1, u, u0, u0, v0, dt);
  advect(N, 2, v, v0, u0, v0, dt);
  project(N, u, v, u0, v0);
}

function project(N, u, v, p, div) {
  let h = 1.0 / N;
  for(let i = 1; i <= N; i++){
    for(let j = 1; j <= N; j++){
      div[IX(i,j)] = - 0.5 * h * (u[IX(i+1,j)] - u[IX(i-1,j)] + v[IX(i,j+1)] - v[IX(i,j-1)]);
      p[IX(i,j)] = 0;
    }
  }
  set_bnd(N, 0, div); 
  set_bnd(N, 0, p);

  for(let k = 0; k < iter; k++){
    for(let i = 1; i < N; i++){
      for(let j = 1; j < N; j++){
        p[IX(i,j)] = (div[IX(i,j)] + p[IX(i-1,j)] + p[IX(i+1, j)] + p[IX(i,j-1)] + p[IX(i,j+1)]) * (1 / 4);
      }
    }
    set_bnd(N, 0, p);
  }

  for(let i = 1; i <= N; i++){
    for(let j = 1; j <= N; j++){
      u[IX(i,j)] -= 0.5 * (p[IX(i+1,j)] - p[IX(i-1,j)]) * (1 / h);
      v[IX(i,j)] -= 0.5 * (p[IX(i,j+1)] - p[IX(i,j-1)]) * (1 / h);
    }
  }
  set_bnd(N, 1, u); 
  set_bnd(N, 2, v);
}
// VELOCITY SOLVER ***************************************

function set_bnd(N, b, x) {
  for(let i = 1; i <= N; i++){
    x[IX(0,i)] = b == 1 ? -x[IX( 1 , i )] : x[IX( 1 , i )];
    x[IX(N-1,i)] = b == 1 ? -x[IX(N-2, i )] : x[IX(N-2, i )];
    x[IX(i,0)] = b == 2 ? -x[IX( i , 1 )] : x[IX( i , 1 )];
    x[IX(i,N-1)] = b == 2 ? -x[IX( i ,N-2)] : x[IX( i ,N-2)];
  }
  x[IX(0,0)] = 0.5 * (x[IX( 1 , 0 )] + x[IX( 0 , 1 )]);
  x[IX(0,N-1)] = 0.5 * (x[IX( 1 , N-1 )] + x[IX( 0 ,N-2)]);
  x[IX(N-1,0)] = 0.5 * (x[IX(N-2, 0 )] + x[IX( N-1 , 1 )]);
  x[IX(N-1,N-1)] = 0.5 * (x[IX(N-2, N )] + x[IX( N-1 ,N-2)]);
}
function add_density() {
  if (mouseIsPressed) {
    if(mouseX<width && mouseY<height){
      dens[IX(int( (N / width) * mouseX ), int( (N / height) * mouseY ))] += source;
      dens[IX(int( (N / width) * mouseX - 1), int( (N / height) * mouseY ))] += source;
      dens[IX(int( (N / width) * mouseX + 1), int( (N / height) * mouseY ))] += source;
      dens[IX(int( (N / width) * mouseX), int( (N / height) * mouseY - 1))] += source;
      dens[IX(int( (N / width) * mouseX), int( (N / height) * mouseY + 1))] += source;
    }
  }
}

function add_velocity() {
  var i;
  if (mouseIsPressed) {
    if(mouseX<width && mouseY<height){
      i = IX(int( (N / width) * mouseX ), int( (N / height) * mouseY ));
      var xv = (N / width) * (mouseX - pmouseX);
      var yv = (N / height) * (mouseY - pmouseY);
      u[i] += xv * (2 / (abs(xv) + 1)) * 15;
      v[i] += yv * (2 / (abs(yv) + 1)) * 15;
    }
  }
}

function renderD_low(){
  let dx, dy, df, di;
  loadPixels();
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      dx = (N / width) * x;
      dy = (N / height) * y;
      df = dens[IX(floor(dx), floor(dy))];
      di = int(df * 255);
      if (di < 0) di = 0;
      if (di > 255) di = 255;
      pixels[PX(x, y)] = di;
      pixels[PX(x, y) + 1] = di;
      pixels[PX(x, y) + 2] = di;
    }
  } 
  updatePixels();
}

function renderD_high(){
  let dx, dy, ddx, ddy;
  let df, di;
  loadPixels();
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      dx = (N / width) * x;
      ddx = dx - int(dx);
      dy = (N / height) * y;
      ddy = dy - int(dy);
      df = (dens[IX(floor(dx), floor(dy))] * (1.0 - ddx) + 
      dens[IX(ceil(dx), floor(dy))] * ddx) * (1.0 - ddy) + 
      (dens[IX(floor(dx), ceil(dy))] * (1.0 - ddx) + 
      dens[IX(ceil(dx), ceil(dy))] * ddx) * ddy;
      di = int(df * 255);
      if (di < 0) di = 0;
      if (di > 255) di = 255;
      pixels[PX(x, y)] = di;
      pixels[PX(x, y) + 1] = di;
      pixels[PX(x, y) + 2] = di;
    }
  } 
  updatePixels();
}

function renderD(){
  colorMode(HSB, 255);  
  let x, y, df, di; 
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      x = (width / N) * i;
      y = (height / N) * j;
      df = dens[IX(i, j)];
      di = int(df * 255);
      fill((di + 50) % 255, 200, di);
      noStroke(255);
      rect(x, y, width / N,  height / N);
    }
  }   
}

function fade(){
  for(let x = 0; x < width; x++){
    for(let y = 0; y < height; y++){
      let i = (N / width) * x;
      let j = (N / height) * y;
      dens[IX(int(i), int(j))] -= 0.00002;
      if(dens[IX(int(i), int(j))]<0) dens[IX(int(i), int(j))] = 0;
      if(dens[IX(int(i), int(j))]>255) dens[IX(int(i), int(j))] = 255;
    }
  }
}
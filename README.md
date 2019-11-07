# Real time Fluid Simulation
After watching [Daniel Shiffman's video](https://www.youtube.com/watch?v=alhpH6ECFvQ), I wanted to create my own code in P5.js, because the one in the video is not using JS. 

I read [Mike Ash's blog post](https://mikeash.com/pyblog/fluid-simulation-for-dummies.html), which has a really good explanation of what is happening, and followed the steps given in the video but I had no succeed.

So I decided to check [Jos Stam's paper](https://pdfs.semanticscholar.org/847f/819a4ea14bd789aca8bc88e85e906cfc657c.pdf) and followed those steps and again no succeed. However, the problems that i had left was rendering the density (or dye as Mike Ash explained in his blog) and adding a velocity and density. 

Later, I found [mslijkhuis's sketch](https://www.openprocessing.org/sketch/455868/) and changed some of my code so it could work and it did. I mainly used his functions add_velocity and add_density. I probably used more of his code but i don't remember.

I added the fade function so density could return to 0 (same in Daniel's video) and changed some lines in set_bnd function.

Using PIXELS instead or rect() for rendering the density has a better result imo (See mslijkhuis's sketch).

[Live demo](https://janh2978.herokuapp.com/fluid)

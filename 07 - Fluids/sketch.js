let myShader;

function preload() {
    // Load the shader from an external file
    myShader = loadShader('shader.vert', 'shader.frag');
}

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    noStroke();
    shader(myShader);
}

function draw() {
    translate(-windowWidth/2, - windowHeight/2)
    // Set uniforms for time and resolution
    myShader.setUniform('u_time', millis() / 1000.0);
    myShader.setUniform('u_resolution', [width, height]);
    
    // Render a rectangle to fill the screen
    stroke(200,0,0)
    strokeWeight(5)
    fill(0,255,0)
    rect(0, 0, width, height);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

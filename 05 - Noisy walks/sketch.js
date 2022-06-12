var agents = [];
var drawMode = 1;




const params = {
    isPlaying: true,
    overlayAlpha: '#F2E9D5',
    agentCount: 4000,
    noiseScale: 300,
    noiseStrength: 10,
    overlayAlpha: 10,
    agentAlpha: 90,
    strokeWidth: 0.3
}

function setup() {

    createCanvas(windowWidth, windowHeight);

    for (var i = 0; i < params.agentCount; i++) {
        agents[i] = new Agent();
    }

    menu = QuickSettings.create(0, 0, "options");

    menu.addBoolean("isPlaying", params.isPlaying, (v) => {
        params.isPlaying = v;
    })
    menu.addRange("agentCount", 2000, 8000, params.agentCount, 50, (v) => {
        params.agentCount = v;
        for (var i = 0; i < params.agentCount; i++) {
            agents[i] = new Agent(params.noiseZRange);
        }
    })
    menu.addRange("noiseScale", 10, 300, params.noiseScale, 1, (v) => {
        params.noiseScale = v;
    })
    menu.addRange("noiseStrength", 0.5, 30, params.noiseStrength, 1, (v) => {
        params.noiseStrength = v;
    })
    menu.addRange("overlayAlpha", 0, 10, params.overlayAlpha, (v) => {
        params.overlayAlpha = v;
    })
    menu.addRange("agentAlpha", 30, 200, params.agentAlpha, (v) => {
        params.agentAlpha = v;
    })
    menu.saveInLocalStorage('NoisyWalksSettings');
};


function draw() {
    push()
        /* fill(255, 0);
        noStroke();
        rect(0, 0, width, height); */

    // Draw agents
    stroke(0, params.agentAlpha);
    for (var i = 0; i < params.agentCount; i++) {
        if (drawMode == 1) agents[i].update1(params.noiseScale, params.noiseStrength, params.strokeWidth);
        else agents[i].update2(params.noiseScale, params.noiseStrength, params.strokeWidth);
    }

    pop()
};

keyReleased = function() {
    if (key == 's' || key == 'S') saveCanvas(random(1986847526097111) + random('lagkfcgvbkzhuyjfdvezb'), 'png');
    if (key == '1') drawMode = 1;
    if (key == '2') drawMode = 2;
    if (key == ' ') {
        var newNoiseSeed = floor(random(10000));
        noiseSeed(newNoiseSeed);
    }
    if (keyCode == DELETE || keyCode == BACKSPACE) background(255);
};


var Agent = function() {
    this.vector = createVector(random(width), random(height));
    this.vectorOld = this.vector.copy();
    this.stepSize = random(1, 5);
    this.isOutside = false;
    this.angle;
};

Agent.prototype.update = function(strokeWidth) {
    this.vector.x += cos(this.angle) * this.stepSize;
    this.vector.y += sin(this.angle) * this.stepSize;
    this.isOutside = this.vector.x < 0 || this.vector.x > width || this.vector.y < 0 || this.vector.y > height;
    if (this.isOutside) {
        this.vector.set(random(width), random(height));
        this.vectorOld = this.vector.copy();
    }
    strokeWeight(strokeWidth * this.stepSize);
    line(this.vectorOld.x, this.vectorOld.y, this.vector.x, this.vector.y);
    this.vectorOld = this.vector.copy();
    this.isOutside = false;
};

Agent.prototype.update1 = function(noiseScale, noiseStrength, strokeWidth) {
    this.angle = noise(this.vector.x / noiseScale, this.vector.y / noiseScale) * noiseStrength;
    this.update(strokeWidth);
};

Agent.prototype.update2 = function(noiseScale, noiseStrength, strokeWidth) {
    this.angle = noise(this.vector.x / noiseScale, this.vector.y / noiseScale) * 24;
    this.angle = (this.angle - floor(this.angle)) * noiseStrength;
    this.update(strokeWidth);
};
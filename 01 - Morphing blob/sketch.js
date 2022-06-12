const name = document.URL.split('/')[document.URL.split('/').length - 2];

var seed = Math.random() * 09876543234567;
var t;
var num, vNum;
var radius;

let pos = [];
let shapes = [];
let n = 0;

const params = {
    noiseStep: .002,
    shapesNumber: 3,
    bgColor: '#D3BFB4',
    shapeGranularity: 10,
    colorsSet: ['#C93D72', '#D9741B', '#BC9F59', '#3B516D'],
    changed: false
}


function setup() {
    randomSeed(seed);
    // pixelDensity(5);
    mySize = min(windowWidth, windowHeight);
    // createCanvas(windowWidth, windowHeight);
    createCanvas(windowWidth, windowHeight);

    background(params.bgColor);
    radius = mySize * 0.00;
    t = 0;

    menu = QuickSettings.create(0, 0, "options");
    menu.addRange("noiseStep", 0.000001, 0.01, params.noiseStep, .0001, (v) => {
        params.noiseStep = v;
        params.changed = true;
    })
    menu.addRange("shapesNumber", 1, 6, params.shapesNumber, 1, (v) => {
        params.shapesNumber = v;
        params.changed = true;
    })
    menu.addRange("shapeGranularity", 5, 30, params.shapeGranularity, 1, (v) => {
        params.shapeGranularity = v;
        params.changed = true;
    })
    menu.addText("bgColor", params.bgColor, (v) => {
        params.bgColor = v;
        params.changed = true;
    })
    menu.addText("color1", params.colorsSet[0], (v) => {
        params.colorsSet[0] = v;
        // drawing();
    })
    menu.addText("color2", params.colorsSet[1], (v) => {
        params.colorsSet[1] = v;
        // drawing();
    })
    menu.addText("color3", params.colorsSet[2], (v) => {
        params.colorsSet[2] = v;
        // drawing();
    })
    menu.addText("color4", params.colorsSet[3], (v) => {
        params.colorsSet[3] = v;
        // drawing();
    })
    menu.addText("color5", params.colorsSet[4], (v) => {
        params.colorsSet[4] = v;
        // drawing();
    })

    menu.saveInLocalStorage('morphingBlobSettings');

    strokeWeight(.4);

    for (let i = 0; i < params.shapesNumber; i++) {
        shapes.push(new Shape({ index: i, color: random(params.colorsSet) }))
    }
}

const setPos = (i, posX, posY) => {
    let angle = (TWO_PI / params.shapeGranularity) * i + t
    let x = posX + (n * sin(angle) / random(100));
    let y = posY + (n * cos(angle) / random(100));
    return createVector(x, y);
}

function draw() {
    n += noise(params.noiseStep);
    randomSeed(seed);
    push();
    translate(width / 2, height / 2);

    for (let shape of shapes) {
        shape.calculatePos();
        shape.display();
    }

    pop();

    t += random(0.001, 0.005);
    if (radius < mySize * 1) {
        radius += random(1, 3);
    } else {
        noLoop();
    }
}

class Shape {
    constructor({ color, index }) {
        this.color = color;
        this.posArray = [];
        this.i = index;

        for (let i = 0; i < params.shapeGranularity; i++) {
            this.posArray[i] = createVector(0, 0);
        }
    }

    calculatePos() {
        for (let i = 0; i < params.shapeGranularity; i++) {
            let angle = (TWO_PI / params.shapeGranularity) * i + t
            let x = this.posArray[i].x + (n * sin(angle) / random(100));
            let y = this.posArray[i].y + (n * cos(angle) / random(100));
            this.posArray[i] = createVector(x, y);
        }
    }

    display() {
        drawingContext.shadowColor = "#ffffff33";
        drawingContext.shadowOffsetX = -1;
        drawingContext.shadowOffsetY = -1;
        drawingContext.shadowBlur = 0;
        drawingContext.shadowColor = "#2f2f2f33";
        drawingContext.shadowOffsetX = 1;
        drawingContext.shadowOffsetY = 1;
        drawingContext.shadowBlur = 0;

        rotate(random(TWO_PI) * this.i / 10 + t);

        noFill();
        stroke(this.color);

        beginShape();
        for (let i = 0; i < params.shapeGranularity; i++) {
            let d = random(radius / 2, radius / 8);
            let x_plus = 0.2 * random(-d, d) / t;
            let y_plus = 0.2 * random(-d, d) / t;
            curveVertex(this.posArray[i].x + x_plus, this.posArray[i].y - y_plus);
        }
        endShape(CLOSE);
    }
}
let angle;
var seed = Math.random() * 9876543;
var c1, c2;

let colorsSet = ['#DBA55F', '#29353F', '#D94315', '#6C9AB8'];

const params = {
    minSize: 30,
    maxSize: 200,
    density: 10,
    circlesDensity: 500,
    bgColor: '#F2E9D5',
    colorsSet: ['#DBA55F', '#29353F', '#D94315', '#6C9AB8'],
    changed: false

}

let circles = [];
let circlePos = []

function setup() {
    randomSeed(seed);
    createCanvas(windowWidth, windowHeight);
    c1 = random(params.colorsSet);
    c2 = random(params.colorsSet.filter(c => c != c1));
    params.angle = random(TWO_PI);
    randomSeed(seed);

    let sketchStarted = false;

    menu = QuickSettings.create(0, 0, "options");

    menu.addButton('randomize', () => {
        c1 = random(params.colorsSet);
        c2 = random(params.colorsSet.filter(c => c != c1));
        if (sketchStarted) placeCircles();
        // params.changed = true;
    })
    menu.addRange("circlesDensity", 30, 800, params.circlesDensity, 10, (v) => {
        params.circlesDensity = v;
        // placeCircles();
        params.changed = true;
    })
    menu.addRange("minSize", 30, params.maxSize, params.minSize, 1, (v) => {
        params.offsetX = v;
        if (sketchStarted) placeCircles();
        // params.changed = true;
    })
    menu.addRange("maxSize", params.minSize, 200, params.maxSize, 1, (v) => {
        params.maxSize = v;
        if (sketchStarted) placeCircles();
        // params.changed = true;
    })
    menu.addRange("density", 5, 30, params.density, 1, (v) => {
        params.density = v;
        drawing();
    })
    menu.addText("bgColor", params.bgColor, (v) => {
        params.bgColor = v;
        drawing();
    })
    menu.addText("color1", params.colorsSet[0], (v) => {
        params.colorsSet[0] = v;
        drawing();
    })
    menu.addText("color2", params.colorsSet[1], (v) => {
        params.colorsSet[1] = v;
        drawing();
    })
    menu.addText("color3", params.colorsSet[2], (v) => {
        params.colorsSet[2] = v;
        drawing();
    })
    menu.addText("color4", params.colorsSet[3], (v) => {
        params.colorsSet[3] = v;
        drawing();
    })
    menu.addText("color5", params.colorsSet[4], (v) => {
        params.colorsSet[4] = v;
        drawing();
    })

    menu.saveInLocalStorage('mySettings');

    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            circlePos.push(createVector(x, y))
        }
    }

    sketchStarted = true;
    noLoop();
    placeCircles();
}

function mouseReleased() {
    if (params.changed) {
        params.changed = false;
        placeCircles();
    }
}

function placeCircles() {
    circles = [];
    let p = 0;

    while (circles.length < params.circlesDensity) {
        let size = random(params.minSize, params.maxSize)
        let density = int(random(4, map(size, params.minSize, params.maxSize * .6, 5, params.density)));
        let rotation = random(TWO_PI);

        let pos = random(circlePos);
        p++;

        if (circles.every(circle => dist(circle.pos.x, circle.pos.y, pos.x, pos.y) > size + circle.size)) {
            circlePos = circlePos.filter(_pos => dist(pos.x, pos.y, _pos.x, _pos.y) > size);

            circles.push(new Circle({
                density,
                size,
                pos,
                rotation
            }));
        }


        /* if (circles.length == 0) {
        } else {
            let overlaping = false;
            for (let circle of circles) {
                if (dist(circle.pos.x, circle.pos.y, pos.x, pos.y) < size + circle.size) {
                    overlaping = true;
                }
            }

            if (!overlaping) {
                circles.push(new Circle({
                    density,
                    size,
                    pos,
                    rotation
                }));
            } else {
                p++;
            }
        } */

        if (p > 10000) {
            console.log('break' + circles.length)
            break;
        }
    }
    console.log('done ' + circles.length)
    drawing();
}

function drawing() {
    push();
    background(params.bgColor);
    noStroke();
    for (let circle of circles) {
        circle._draw();
    }
    pop();
}


class Circle {
    constructor({ pos = new p5.Vector(), size = params.minSize, density = params.density, rotation = random(TWO_PI) }) {
        this.pos = pos;
        this.size = size;
        this.density = density;
        this.rotation = rotation;
    }

    _draw() {
        push();
        translate(this.pos.x, this.pos.y);
        rotate(this.rotation);
        stroke(c1);
        strokeWeight(3);
        for (let k = .3; k < this.density + 1; k++) {
            let d = (k * (this.size * 2 / this.density)) - this.size;
            let y = sqrt((this.size * this.size) - (d * d));
            line(d / 2, -y / 2, d / 2, y / 2)
        }
        pop();
    }
}
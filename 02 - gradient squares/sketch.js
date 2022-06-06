let angle;
var seed = Math.random() * 9876543;
var c1, c2;
// let colors1 = "fef9fb-fafdff-ffffff-fcfbf4-f9f8f6".split("-").map((a) => "#" + a);
// let colors2 = "8c75ff-c553d2-2dfd60-2788f5-23054f-f21252-8834f1-c4dd92-184fd3-f9fee2-2E294E-541388-F1E9DA-FFD400-D90368-e9baaa-ffa07a-164555-ffe1d0-acd9e7-4596c7-6d8370-e45240-21d3a4-3303f9-cd2220-173df6-244ca8-a00360-b31016".split("-").map((a) => "#" + a);
let colorsSet = ['#DBA55F', '#29353F', '#D94315', '#6C9AB8'];

const params = {
    offsetX: 1,
    offsetY: -1,
    shadowBlur: 200,
    rectOffset: 100,
    density: 5,
    bgColor: '#F2E9D5',
    angle: 0,
    colorsSet: ['#DBA55F', '#29353F', '#D94315', '#6C9AB8'],
    changed: false

}

function setup() {
    randomSeed(seed);
    createCanvas(windowWidth, windowHeight);
    c1 = random(params.colorsSet);
    c2 = random(params.colorsSet.filter(c => c != c1));
    params.angle = random(TWO_PI);
    randomSeed(seed);

    menu = QuickSettings.create(0, 0, "options");

    menu.addButton('randomize', () => {
        c1 = random(params.colorsSet);
        c2 = random(params.colorsSet.filter(c => c != c1));
        drawing();
        // params.changed = true;
    })
    menu.addRange("angle", 0, 360, params.angle, 1, (v) => {
        params.angle = radians(v);
        drawing();
        // params.changed = true;
    })
    menu.addRange("offsetX", -10, 10, params.offsetX, 1, (v) => {
        params.offsetX = v;
        drawing();
        // params.changed = true;
    })
    menu.addRange("offsetY", -10, 10, params.offsetY, 1, (v) => {
        params.offsetY = v;
        drawing();
        // params.changed = true;
    })
    menu.addRange("shadowBlur", 0, 500, params.shadowBlur, 1, (v) => {
        params.shadowBlur = v;
        // params.changed = true;
        drawing();
    })
    menu.addRange("rectOffset", -100, 500, params.rectOffset, 1, (v) => {
        params.rectOffset = v;
        drawing();
    })
    menu.addRange("density", 1, 30, params.density, 1, (v) => {
        params.density = v;
        params.changed = true;
    })
    menu.addText("bgColor", params.bgColor, (v) => {
        params.bgColor = v;
        params.changed = true;
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

    noLoop()
    drawing();
}

function mouseReleased() {
    if (params.changed) {
        params.changed = false;
        drawing();
    }
}

function drawing() {
    push()
    background(params.bgColor);
    noStroke();
    let rectBoudings = Math.floor(random(100, params.rectOffset));

    for (let i = 0; i < width; i += rectBoudings) {
        for (let j = 0; j < height; j += rectBoudings) { // grid displacement
            for (let k = 0; k < params.density; k++) {
                push();
                fill(c1);
                translate(i, j);
                rotate((Math.floor(random(1, 5)) * TWO_PI / 4) + params.angle);

                let rectWidth = random(rectBoudings);
                let rectHeight = random(rectBoudings * random(.5, 2));
                grad = setGradient(rectWidth, rectHeight, random(1) > .5)

                rect(0, k, rectWidth, rectHeight);
                pop();
            }
        }
    }
    pop()
}

const setGradient = (rectWidth, rectHeight, color) => {
    drawingContext.shadowColor = random(params.colorsSet);
    drawingContext.shadowOffsetX = random(-params.offsetX, params.offsetX);
    drawingContext.shadowOffsetY = random(-params.offsetY, params.offsetY);
    drawingContext.shadowBlur = params.shadowBlur;

    let grad = drawingContext.createLinearGradient(0, rectHeight, rectWidth, rectHeight);
    try {
        grad.addColorStop(0.95, str(color ? c1 : c2) + "e6");
        grad.addColorStop(0.15, str(random(params.colorsSet)) + "00");
    } catch {
        console.warn("Color code isn't valid");
    }
    drawingContext.fillStyle = grad;

    return grad
}

function keyPressed() {
    if (keyCode == ENTER) {
        console.log(`randomSeed : ${seed}`)
        saveCanvas(name + '--' + new Date(), "png");
    }
}
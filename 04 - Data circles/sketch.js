//sound
let mySound;
let amplitude, fft;
let level;

let seed;
let angle_c;
let colors = [];
let colors0 = "281914-1a1a1a-202020-242e30".split("-").map((a) => "#" + a);
let colors7 = "fefefe-292929-ffffff-222222-202020".split("-").map((a) => "#" + a);
let colors8 = "8c75ff-c553d2-2dfd60-2788f5-23054f-f21252-8834f1-c4dd92-184fd3-f9fee2-2E294E-541388-F1E9DA-FFD400-D90368-e9baaa-ffa07a-164555-ffe1d0-acd9e7-4596c7-6d8370-e45240-21d3a4-3303f9-cd2220-173df6-244ca8-a00360-b31016".split("-").map((a) => "#" + a);
var color_setup1, color_setup2;
let color_bg;
let branch;

let graphics = [];

const params = {
    isPlaying: false,
    bgColor: '#F2E9D5',
    colorsSet: ['#2E294E', '#D90368', '#D94315', '#6C9AB8', '#f21252', '#184fd3', '#DBA55F', '#29353F'],
    changed: false
}

function preload() {
    soundFormats('mp3', 'ogg');
    mySound = loadSound('./data/Machine Heart & Machine Man.mp3');
}

function setup() {
    seed = int(random(34567890));
    createCanvas(windowWidth, windowHeight);
    colorMode(HSB, 360, 100, 100, 100);
    background(params.bgColor);
    angle_c = 0;
    branch = int(random(4, 20));

    let jumpTime = random(mySound.duration / 7, mySound.duration / 4)
    mySound.jump(mySound.duration, jumpTime)
    mySound.setVolume(0.5);

    amplitude = new p5.Amplitude();
    fft = new p5.FFT();


    for (let k = 0; k < 8; k++) {
        graphics[k] = createGraphics(windowWidth, windowHeight)
    }

    menu = QuickSettings.create(0, 0, "options");

    menu.addBoolean("bgColor", params.bgColor, (v) => {
        params.isPlaying = v;
        togglePlay();
    })
    menu.addText("bgColor", params.bgColor, (v) => {
        params.bgColor = v;
        background(params.bgColor);
    })
    menu.addText("color1", params.colorsSet[0], (v) => {
        params.colorsSet[0] = v;
    })
    menu.addText("color2", params.colorsSet[1], (v) => {
        params.colorsSet[1] = v;
    })
    menu.addText("color3", params.colorsSet[2], (v) => {
        params.colorsSet[2] = v;
    })
    menu.addText("color4", params.colorsSet[3], (v) => {
        params.colorsSet[3] = v;
    })
    menu.addText("color5", params.colorsSet[4], (v) => {
        params.colorsSet[4] = v;
    })
    menu.addText("color6", params.colorsSet[5], (v) => {
        params.colorsSet[5] = v;
    })
    menu.addText("color7", params.colorsSet[6], (v) => {
        params.colorsSet[6] = v;
    })
    menu.addText("color8", params.colorsSet[7], (v) => {
        params.colorsSet[7] = v;
    })

    menu.saveInLocalStorage('DataCircleSettings');
}

function draw() {
    let vol = amplitude.getLevel();
    let spectrum = fft.analyze();
    let bassFilter = map(fft.getEnergy('bass'), 0, 255, 30, height + random(50)) // max 255
    let lowMidFilter = map(fft.getEnergy('lowMid'), 0, 255, 30, height + random(50)) // max 255
    let midFilter = map(fft.getEnergy('mid'), 0, 255, 30, height + random(50)) // max 255
    let highMidFilter = map(fft.getEnergy('highMid'), 0, 255, 30, height + random(50)) // max 255
    let trebleFilter = map(fft.getEnergy('treble'), 0, 255, 30, height + random(50)) // max 255

    randomSeed(seed);
    let vol_m = map(vol, 0, 1, 1, 50);
    let angle = angle_c * random(-vol_m, vol_m);

    // if (frameCount % 100 == 0) {
    circleForm(bassFilter, angle);
    circleForm(lowMidFilter, angle);
    circleForm(midFilter, angle);
    circleForm(highMidFilter, angle);
    circleForm(trebleFilter, angle);
    // }

    if (frameCount % 200 == 0 && branch < 200) {
        branch += vol_m;
        angle_c += TAU / 360;
    } else if (branch >= 200) {
        branch = 4;
        frameCount = 0;
    }

    for (let graphic of graphics) {
        image(graphic, 0, 0)
    }
}

function circleForm(filter, angle) {
    let ang = TWO_PI / branch;
    let angles = [];

    for (let i = 0; i < branch; i++) {
        angles.push(ang * (i + iteration(0.1, 0.25)));
    }

    for (let i = 0; i < branch; i++) {
        let ang1 = angles[i];
        let ang2 = angles[(i + int(random(6))) % angles.length];
        let distance = filter * iteration(0.1, 1);

        let k = int(random(params.colorsSet.length));
        graphics[k].drawingContext.shadowOffsetX = 1;
        graphics[k].drawingContext.shadowColor = random(params.bgColor);
        graphics[k].drawingContext.shadowOffsetY = 1;
        graphics[k].drawingContext.shadowBlur = 0;
        graphics[k].noFill();
        graphics[k].stroke(params.colorsSet[k]);
        graphics[k].strokeWeight(random(1, 3));
        graphics[k].arc((width / 2), (height / 2), distance, distance, ang1 + angle, ang2 + angle);
    }
}

function iteration(s, e) {
    let t = random(10, 100);
    let v = random(0.001, 0.01);
    return map(cos(t + frameCount * v), -1, 1, s, e);
}

function keyTyped() {
    mySound.pause()

    if (keyCode == ENTER) {
        let k = 0
        for (let graphic of graphics) {
            saveCanvas(graphic, `layer ${k} -- ` + seed + ' - ' + random(76516543345), 'png')
            k++;
        }

    }
    mySound.play()
}

function togglePlay() {
    if (!params.isPlaying) {
        noLoop();
        mySound.pause();
        console.log('pause')
    } else {
        loop();
        console.log('play')
        mySound.play()
    }
}
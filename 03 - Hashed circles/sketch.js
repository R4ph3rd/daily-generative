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

    sketchStarted = true;
    //noLoop();
    placeCircles().then(() => {
        console.log('done ' + circles.length)
        drawing();
    });
}

function mouseReleased() {
    if (params.changed) {
        params.changed = false;
        placeCircles();
    }
}

function placeCircles() {
    return new Promise((resolve, reject) => {
        circles = [];
        let p = 0;
        while (circles.length < params.circlesDensity) {
            let size = random(params.minSize, params.maxSize)
            let density = int(random(4, map(size, params.minSize, params.maxSize * .6, 5, params.density)));
            let rotation = random(TWO_PI);
            let pos = createVector(random(width), random(height));

            if (circles.length == 0) {
                circles.push(new Circle({
                    density,
                    size,
                    pos,
                    rotation
                }));
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
            }

            if (p > 10000) {
                console.log('break' + circles.length)
                resolve(circles);
                break;
            }
        }

        resolve(circles);
    })
}

function draw() {
    drawing();
}

function drawing() {
    push();
    background(params.bgColor);
    noStroke();
    for (let circle of circles) {
        circle.update();
        circle.checkBoundaryCollision();
        for (let other of circles.filter(c => c != circle)) {
            circle.checkCollision(other);
        }
        circle._draw();
    }
    pop();
}


class Circle {
    constructor({ pos = new p5.Vector(random(width), random(height)), size = params.minSize, density = params.density, rotation = random(TWO_PI) }) {
        this.pos = pos;
        this.size = size;
        this.density = density;
        this.rotation = rotation;
        this.velocity = p5.Vector.random2D();
        this.velocity.mult(3);
        this.m = size * 0.1;
    }

    update() {
        this.pos.add(this.velocity);
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

    checkBoundaryCollision() {
        if (this.pos.x > width - this.size) {
            this.pos.x = width - this.size;
            this.velocity.x *= -1;
        } else if (this.pos.x < this.size) {
            this.pos.x = this.size;
            this.velocity.x *= -1;
        } else if (this.pos.y > height - this.size) {
            this.pos.y = height - this.size;
            this.velocity.y *= -1;
        } else if (this.pos.y < this.size) {
            this.pos.y = this.size;
            this.velocity.y *= -1;
        }
    }

    checkCollision(other) {
        // Get distances between the balls components
        let distanceVect = p5.Vector.sub(other.pos, this.pos);

        // Calculate magnitude of the vector separating the balls
        let distanceVectMag = distanceVect.mag();

        // Minimum distance before they are touching
        let minDistance = this.size + other.r;

        if (distanceVectMag < minDistance) {
            let distanceCorrection = (minDistance - distanceVectMag) / 2.0;
            let d = distanceVect.copy();
            let correctionVector = d.normalize().mult(distanceCorrection);
            other.pos.add(correctionVector);
            this.pos.sub(correctionVector);

            // get angle of distanceVect
            let theta = distanceVect.heading();
            // precalculate trig values
            let sine = sin(theta);
            let cosine = cos(theta);

            /* bTemp will hold rotated ball this.positions. You 
             just need to worry about bTemp[1] this.pos*/
            let bTemp = [new p5.Vector(), new p5.Vector()];

            /* this ball's this.pos is relative to the other
             so you can use the vector between them (bVect) as the 
             reference point in the rotation expressions.
             bTemp[0].this.pos.x and bTemp[0].this.pos.y will initialize
             automatically to 0.0, which is what you want
             since b[1] will rotate around b[0] */
            bTemp[1].x = cosine * distanceVect.x + sine * distanceVect.y;
            bTemp[1].y = cosine * distanceVect.y - sine * distanceVect.x;

            // rotate Temporary velocities
            let vTemp = [new p5.Vector(), new p5.Vector()];

            vTemp[0].x = cosine * this.velocity.x + sine * this.velocity.y;
            vTemp[0].y = cosine * this.velocity.y - sine * this.velocity.x;
            vTemp[1].x = cosine * other.velocity.x + sine * other.velocity.y;
            vTemp[1].y = cosine * other.velocity.y - sine * other.velocity.x;

            /* Now that velocities are rotated, you can use 1D
             conservation of momentum equations to calculate 
             the final this.velocity along the x-axis. */
            let vFinal = [new p5.Vector(), new p5.Vector()];

            // final rotated this.velocity for b[0]
            vFinal[0].x =
                ((this.m - other.m) * vTemp[0].x + 2 * other.m * vTemp[1].x) /
                (this.m + other.m);
            vFinal[0].y = vTemp[0].y;

            // final rotated this.velocity for b[0]
            vFinal[1].x =
                ((other.m - this.m) * vTemp[1].x + 2 * this.m * vTemp[0].x) /
                (this.m + other.m);
            vFinal[1].y = vTemp[1].y;

            // hack to avoid clumping
            bTemp[0].x += vFinal[0].x;
            bTemp[1].x += vFinal[1].x;

            /* Rotate ball this.positions and velocities back
             Reverse signs in trig expressions to rotate 
             in the opposite direction */
            // rotate balls
            let bFinal = [new p5.Vector(), new p5.Vector()];

            bFinal[0].x = cosine * bTemp[0].x - sine * bTemp[0].y;
            bFinal[0].y = cosine * bTemp[0].y + sine * bTemp[0].x;
            bFinal[1].x = cosine * bTemp[1].x - sine * bTemp[1].y;
            bFinal[1].y = cosine * bTemp[1].y + sine * bTemp[1].x;

            // update balls to screen this.pos
            other.pos.x = this.pos.x + bFinal[1].x;
            other.pos.y = this.pos.y + bFinal[1].y;

            this.pos.add(bFinal[0]);

            // update velocities
            this.velocity.x = cosine * vFinal[0].x - sine * vFinal[0].y;
            this.velocity.y = cosine * vFinal[0].y + sine * vFinal[0].x;
            other.velocity.x = cosine * vFinal[1].x - sine * vFinal[1].y;
            other.velocity.y = cosine * vFinal[1].y + sine * vFinal[1].x;
        }
    }
}
function keyPressed() {
    if (keyCode == ENTER) {
        console.log(`randomSeed : ${seed}`)
        saveCanvas(name + '--' + new Date(), "png");
    }
}
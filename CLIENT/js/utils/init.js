
let frms = 0;
let dx = 2;
let w_ratio = 1/3;
let h_ratio = 1;
const RAD = Math.PI/180;

function init() {
    const body = document.getElementsByTagName('body')[0];
    const scrn = document.createElement('canvas');
    body.prepend(scrn)
    const sctx = scrn.getContext("2d");
    scrn.width = innerWidth * w_ratio;
    scrn.height = innerHeight * h_ratio;
    const jumpInputHandler = () => {
        switch (state.curr) {
            case state.getReady :
                state.curr = state.Play;
                SFX.start.play();
                SFX.bgm.play();
                break;
            case state.Play :
                bird.flap(SFX);
                break;
            case state.gameOver :
                state.curr = state.getReady;
                bird.speed = 0;
                bird.y = 100;
                pipe.pipes=[];
                UI.score.curr = 0;
                SFX.played=false;
                break;
        }
    }
    scrn.tabIndex = 1;
    scrn.addEventListener("click", jumpInputHandler)
    scrn.onkeydown = function keyDown(e) {
        (e.keyCode == 32 || e.keyCode == 87 || e.keyCode == 38) && jumpInputHandler()   // Space Key or W key or arrow up
    }
    const state = new State()
    const SFX = new Sfx()
    const gnd = new GND()
    const bg = new Background(scrn)
    const pipe = new PipeSet()
    const bird = new Bird()
    const UI = new Ui()
    const sizeRatio = gnd.getSize(scrn);
    handdleSizeChange(sizeRatio, bird, pipe, gnd, bg);
    gameLoop(bird, state, SFX, UI, pipe, gnd, sctx, scrn, bg);
}

function gameLoop(bird, state, sfx, ui, pipe, gnd, sctx, scrn, bg, start) {
    update(bird, state, sfx, ui, pipe, gnd, scrn, bg)
    draw(scrn, sctx, bg, pipe, bird, gnd, ui, state)
    frms++
    requestAnimationFrame(() => {
        gameLoop(bird, state, sfx, ui, pipe, gnd, sctx, scrn, bg)
    })
}

function update(bird, state, sfx, ui, pipe, gnd, scrn, bg) {
    bird.update(state, sfx, ui, pipe, gnd) 
    gnd.update(state)
    pipe.update(state, scrn)
    ui.update(state)
    bg.update(state)
}
function draw(scrn, sctx, bg, pipe, bird, gnd, ui, state) {
   sctx.fillStyle = "#30c0df"
   sctx.fillRect(0,0,scrn.width,scrn.height)
   bg.draw(scrn, sctx)
   pipe.draw(sctx)
   
   bird.draw(sctx)
   gnd.draw(sctx, scrn)
   ui.draw(state, sctx, scrn)
}
function handdleSizeChange(sizeRatio, bird, pipe, gnd, bg) {
  bird.sizeChange(sizeRatio);
  pipe.sizeChange(sizeRatio);
  gnd.sizeChange(sizeRatio);
  bg.sizeChange(sizeRatio);
}
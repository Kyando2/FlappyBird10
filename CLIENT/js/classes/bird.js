class Bird {
    constructor() {
        this.animations = BIRDANIMS
        this.rotatation = BIRD_DEFAULTS.rotatation
        this.x = BIRD_DEFAULTS.x
        this.y = BIRD_DEFAULTS.y
        this.movingToCenter = {
            t: false,
            fr: 0,
            rn: 0
        }
        this.speed = BIRD_DEFAULTS.speed
        this.gravity = BIRD_DEFAULTS.gravity
        this.thrust = BIRD_DEFAULTS.thrust
        this.frame = BIRD_DEFAULTS.frame
    }
    draw(sctx) {
        let h = this.animations[this.frame].sprite.height
        let w = this.animations[this.frame].sprite.width
        sctx.save()
        sctx.translate(this.x,this.y)
        sctx.rotate(this.rotatation*RAD)
        sctx.drawImage(this.animations[this.frame].sprite,-w/2,-h/2, w, h)
        sctx.restore()
    }
    update(state, SFX, UI, games, gnd, scrn) {
        if (this.movingToCenter.t) {
            let tdd = scrn.width/2 - this.x
            let tmv = tdd/this.movingToCenter.ln
            this.x+=tmv
            this.fr -= 1
            if (this.fr == 0) {
                this.movingToCenter.t = false
            }
        }
        let r = parseFloat(this.animations[0].sprite.width)/2
        switch (state.curr) {
            case state.getReady :
                this.rotatation = 0
                this.y +=(frms%10==0) ? Math.sin(frms*RAD) :0
                this.frame += (frms%10==0) ? 1 : 0
                break
            case state.Play :
                this.frame += (frms%(1/BIRD_ANIMATION_SPEED)==0) ? 1 : 0
                this.y += this.speed
                this.setRotation()
                this.speed += this.gravity
                if(this.y + r  >= gnd.y||this.collisioned(games, UI, SFX, state)) {
                    state.curr = state.gameOver
                    this.movingToCenter.t = false
                    SFX.bgm.pause()
                    SFX.bgm.currentTime = 0
                }
                break
                this.frame = 1
                if(this.y + r  < gnd.y) {
                    this.y += this.speed
                    this.setRotation()
                    this.speed += this.gravity*2
                } else {
                    this.speed = 0
                    this.y=gnd.y-r
                    this.rotatation=90
                    if(!SFX.played) {
                        SFX.die.play()
                        SFX.played = true
                    }
                }
                
                break
        }
        this.frame = this.frame%this.animations.length       
    }
    flap(SFX) {
        if(this.y > 0) {
            SFX.flap.play()
            this.speed = -this.thrust
        }
    }
    setRotation() {
        if(this.speed <= 0) {
            this.rotatation = Math.max(BIRD_DOWN_ROTATION, BIRD_DOWN_ROTATION * this.speed/(-1*this.thrust))
        } else if(this.speed > 0 ) {
            this.rotatation = Math.min(BIRD_UP_ROTATION, BIRD_UP_ROTATION * this.speed/(this.thrust*2))
        }
    }
    goToCenter(ln=500) {
        this.movingToCenter.t = true
        this.movingToCenter.ln = ln
        this.movingToCenter.fr = ln
    }
    collisioned(games, UI, SFX, state) {
        let bird = this.animations[0].sprite
        let r = bird.height/4 +bird.width/4
        
        // pipe.pipes.every((e,i) => {
        //   if (e.x <= this.x+r && e.x+pipe.w >= this.x - r) {
        //     x = e.x
        //     y = e.y
        //     return false
        //   } else if (e.x >= this.x-r) {
        //     x = e.x
        //     y = e.y
        //     return false
        //   }
        //   return true
        // })
        var x, y, g
        if (state.gameStage !== 2) {
            var HIT = false
            games.fireball.fireballs.forEach(fb => {
                var x, y, h, w 

                x = fb.x
                y = fb.y
                h = fb.h
                w = fb.w
                if(this.x+r >= x) {
                    if(this.x+r <= x + w) {
                        if(this.y+r >= y && this.y+r <= y + h) {
                            SFX.bgm.pause()
                            SFX.bgm.currentTime = 0
                            SFX.hit.play()  
                            HIT = true
                        }
                    }
                }
                if(this.x >= x) {
                    if(this.x <= x + w) {
                        if(this.y >= y && this.y <= y + h) {
                            SFX.bgm.pause()
                            SFX.bgm.currentTime = 0
                            SFX.hit.play()  
                            HIT = true
                        }
                    }
                }
            })
            if (HIT) {
                return true
            }
        }

        if(!games.pipe.pipes.length) return

        const pipe = games.pipe
        x = pipe.pipes[0].x
        y = pipe.pipes[0].y
        g = pipe.pipes[0].gap

        let roof = y + parseFloat(pipe.h)
        let floor = roof + g
        let w = parseFloat(pipe.w)
        if(this.x + r>= x) {
            if(this.x + r < x + w) {
                if(this.y - r <= roof || this.y + r>= floor) {
                    SFX.bgm.pause()
                    SFX.bgm.currentTime = 0
                    SFX.hit.play()  
                    return true
                }

            }
            else if(pipe.moved) {
                UI.score.curr++
                SFX.score.play()
                pipe.moved = false
            }  
        }

    }
    sizeChange(sizeRatio) {
        this.h = this.animations[this.frame].sprite.height * sizeRatio
        this.w = this.animations[this.frame].sprite.width * sizeRatio
        this.gravity *= sizeRatio
        this.thrust *= sizeRatio
        this.animations.map(e => {
            e.sprite.height *= sizeRatio
            e.sprite.width *= sizeRatio
            return e
        })
    }
 }
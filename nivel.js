const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

const jumpSound = new Audio('sonidos/saltoaudio.m4a'); // cargar el archivo de sonido
const gameOverSound = new Audio('sonidos/gameoverr.m4a'); 
const pauseBtn = document.getElementById('pauseBtn')
const resumeBtn = document.getElementById('resumeBtn')
const restartBtn = document.getElementById('restartBtn')
const restartJBtn = document.getElementById('restartJBtn')

const keys = {
    d: {
        pressed: false,
    },
    a: {
        pressed: false,
    },
    w: {
        pressed: false,
    },
}

class Level {
    constructor(level_id, block_ids, scaling, spawn_coords, background_image_height) { //modif in current
        //       int       [int]      float   [float, float]          int
        // momento esquizofrenico en ingles
        //lives = 3
        this.is_paused = false
        this.background_image_height = background_image_height
        this.spawn_coords = spawn_coords //player spawn coords

        this.level_id = level_id
        this.block_ids = block_ids
        this.level_name = levelNames[level_id]

        // initialize canvas
        canvas.width = 1420 //set the canvas size
        canvas.height = 750

        this.scaledCanvas = {
            width: 1420 / scaling, // primernivel_nuevo.js
            height: 750 / scaling,
        }

        this.background = new Sprite({
            position: {
                x: 0,
                y: 0,
            },
            imageSrc: 'img/' + this.level_name + '.png', //load the correct background
        })

        this.camera = {
          position: {
            x: 0,
            y: -background_image_height + this.scaledCanvas.height,
          },
        }

        // initialize collisions
        let floorCollisions2D = []
        let curFloorCollisions = floorCollisions[level_id] //agarrar information para este nivel
        for (let i = 0; i < curFloorCollisions.length; i += 65) { //65 = blocks per row
            floorCollisions2D.push(curFloorCollisions.slice(i, i + 65))
        }

        let collisionBlocks = []
        let puerta_id = block_ids["puerta"]
        let pinchos_id = block_ids["pinchos"]
        floorCollisions2D.forEach((row, y) => {
            row.forEach((symbol, x) => {
                var label
                if (symbol === 0) { //nada
                    return
                } else if (symbol === puerta_id) {
                    label = "puerta"
                } else if (symbol === pinchos_id) {
                    label = "pinchos"
                } else {
                    label = "suelo" 
                }
                collisionBlocks.push(
                    new CollisionBlock({
                        symbol: symbol,
                        block_type: label, 
                        position: {
                            x: x * 16,
                            y: y * 16,
                        },
                    })
                )
            })
        })

        //let platformCollisions2D = []
        //let curPlatformCollisions = platformCollisions[level_id] //agarrar information para este nivel
        //for (let i = 0; i < curPlatformCollisions.length; i += 65) {
        //    platformCollisions2D.push(curPlatformCollisions.slice(i, i + 65))
        //}
        //let platformCollisionBlocks = []

        const gravity = 1

        this.player = new Player({
            position: {
                x: spawn_coords[0],
                y: spawn_coords[1],
            },

            collisionBlocks,
            //platformCollisionBlocks,
            imageSrc: './img/personaje/Idle.png',
            frameRate: 8,
            animations: {
                Idle: {
                    imageSrc: './img/personaje/Idle.png',
                    frameRate: 8,
                    frameBuffer: 5,
                },
                Run: {
                    imageSrc: './img/personaje/Run.png',
                    frameRate: 8,
                    frameBuffer: 5,
                },
                Jump: {
                    imageSrc: './img/personaje/Jump.png',
                    frameRate: 2,
                    frameBuffer: 3,
                },
                Fall: {
                    imageSrc: './img/personaje/Fall.png',
                    frameRate: 2,
                    frameBuffer: 3,
                },
                FallLeft: {
                    imageSrc: './img/personaje/FallLeft.png',
                    frameRate: 2,
                    frameBuffer: 3,
                },
                RunLeft: {
                    imageSrc: './img/personaje/RunLeft.png',
                    frameRate: 8,
                    frameBuffer: 5,
                },
                IdleLeft: {
                    imageSrc: './img/personaje/IdleLeft.png',
                    frameRate: 8,
                    frameBuffer: 3,
                },
                JumpLeft: {
                    imageSrc: './img/personaje/JumpLeft.png',
                    frameRate: 2,
                    frameBuffer: 3,
                },
            },
        })


        pauseBtn.addEventListener('click', () => {
            this.is_paused = true
            pauseBtn.disabled = true
            resumeBtn.disabled = false
        })

        resumeBtn.addEventListener('click', () => {
            this.is_paused = false
            this.animate()
            pauseBtn.disabled = false
            resumeBtn.disabled = true
        })

        restartBtn.addEventListener('click', () => {
            window.location.reload()
            localStorage.setItem('lives', 3)
        })

        restartJBtn.addEventListener('click', () => {
            window.location.href = "primernivel.html"
            localStorage.setItem('lives', 3)
        })

        this.animate()

        window.addEventListener('keydown', (event) => {
            switch (event.key) {
                case 'd':
                    keys.d.pressed = true
                    break
                case 'a':
                    keys.a.pressed = true
                    break
                case 'w':
                    console.log('reproduciendo sonido')
                    jumpSound.play();
                    if (this.player.velocity.y === 0) keys.w.pressed = this.player.velocity.y = -14
                    break
            }
        })


        window.addEventListener('keyup', (event) => {
            switch (event.key) {
                case 'd':
                    keys.d.pressed = false
                    break
                case 'a':
                    keys.a.pressed = false
                    break
            }
        })



    }


    animateHelper(obj) {
        obj.animate()

    }

    

    animate() {
        var lives = localStorage.getItem('lives')
        if (lives <= 0) {//game over
            return
        }

        if (!this.is_paused) {
            window.requestAnimationFrame(() => this.animateHelper(this)) //call this Level's animateHelper
        }

        c.fillStyle = 'white'
        c.fillRect(0, 0, canvas.width, canvas.height)
        c.save()
        c.scale(2.1, 2.1)


        c.translate(this.camera.position.x, this.camera.position.y)
        this.background.update()

        this.player.checkForHorizontalCanvasCollision()
        
        if (this.player.door === true) {
            localStorage.setItem('lives', lives)
            window.location.href = levelNames[this.level_id + 1] + '.html'
        } 

        this.player.update()
        this.player.velocity.x = 0
        if (keys.d.pressed) {
            this.player.switchSprite('Run')
            if (this.player.velocity.y < 0) {
                this.player.velocity.x = 4
            } else {
                this.player.velocity.x = 2
            }
            this.player.lastDirection = 'right'
            this.player.shouldPanCameraToTheLeft({ canvas, camera: this.camera })
        } else if (keys.a.pressed) {
            this.player.switchSprite('RunLeft')
            if (this.player.velocity.y < 0) {
                this.player.velocity.x = -4
            } else {
                this.player.velocity.x = -2
            }
            this.player.lastDirection = 'left'
            this.player.shouldPanCameraToTheRight({ canvas, camera: this.camera })
        } else if (this.player.velocity.y === 0) {
            if (this.player.lastDirection === 'right') this.player.switchSprite('Idle')
            else this.player.switchSprite('IdleLeft')
        }
        if (this.player.velocity.y < 0) {
            this.player.shouldPanCameraDown({ camera: this.camera, canvas })
            if (this.player.lastDirection === 'right') this.player.switchSprite('Jump')
            else this.player.switchSprite('JumpLeft')
        } else if (this.player.velocity.y > 0) {
            this.player.shouldPanCameraUp({ camera: this.camera, canvas })
            if (this.player.lastDirection === 'right') this.player.switchSprite('Fall')
            else this.player.switchSprite('FallLeft')
        }


        if (this.player.position.y > canvas.height || this.player.pmuerte === true) {
            lives--;
            document.getElementById("lives").textContent = "Vidas: " + lives;
            this.player.pmuerte = false
            if (lives <= 0) { // muerte
                localStorage.setItem("lives", 0)
                gameOverSound.play()
                const gameOverMsg = document.createElement("h1");
                gameOverMsg.textContent = "Game Over";
                gameOverMsg.style.color = "white"; 
                document.getElementById("game-container").appendChild(gameOverMsg);
                document.getElementById("pauseBtn").disabled = true;
                document.getElementById("resumeBtn").disabled = true;
            } else {
                this.player.position.x = this.spawn_coords[0];
                this.player.position.y = this.spawn_coords[1];
                this.camera.position.x = 0;
                this.camera.position.y = -this.background_image_height + this.scaledCanvas.height;
            }
        }  
        
        localStorage.setItem('lives', lives)
        c.restore()
    }

}














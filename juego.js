const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1420 
canvas.height = 750

const scaledCanvas = {
    width: canvas.width / 2,
    height: canvas.height / 2,
}

const floorCollisions2D = []
for (let i = 0; i < floorCollisions.length; i += 65) {
    floorCollisions2D.push(floorCollisions.slice(i, i + 65))
}

const collisionBlocks = []
floorCollisions2D.forEach((row, y) => {
    row.forEach((symbol, x) => {
        console.log(symbol)
        if(symbol === 271 || symbol === 280 || symbol === 279) {
            collisionBlocks.push(new CollisionBlock({position: {
                x: x * 16,
                y: y * 16,
            },
        })
        )
        }
    })
})

const platformCollisions2D = []
for (let i = 0; i < platformCollisions.length; i += 65) {
    platformCollisions2D.push(platformCollisions.slice(i, i + 65))
}


const platformCollisionBlocks = []
platformCollisions2D.forEach((row, y) => {
    row.forEach((symbol, x) => {
        console.log(symbol)
        if(symbol === 279) {
            platformCollisionBlocks.push(new CollisionBlock({position: {
                x: x * 16,
                y: y * 16,
            },
        })
        )
        }
    })
})

const gravity = 1


const player = new Player({
    position: {
        x: 207,
        y: 350,
    },
    collisionBlocks, 
    imageSrc: './img/personaje/Idle.png',
    frameRate: 10,
})

const keys = {
    d: {
        pressed: false
    },
    a: {
        pressed: false
    },
    w: {
        pressed: false
    }
}

let lastKey

const background = new Sprite({
    position: {
        x: 0,
        y: 0,
    },
    imageSrc: 'img/Fondo.jpeg',
})

function animate () {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'white'
    c.fillRect(0, 0, canvas.width, canvas.height)

    c.save()
    // c.scale(3.5, 3.5)
    // c.translate(0, -background.image.height + scaledCanvas.height)
    background.update()
    collisionBlocks.forEach((collisionBlock) => {
        collisionBlock.update()
    })

    platformCollisionBlocks.forEach((block) => {
        block.update()
    })

    player.update()

    player.velocity.x = 0
    if(keys.d.pressed && lastKey === 'd') player.velocity.x = 2
    else if (keys.a.pressed && lastKey === 'a') player.velocity.x = -2

    c.restore()
}

animate()

window.addEventListener('keydown', (event) =>{
    switch(event.key) {
        case 'd':
        keys.d.pressed = true
        lastKey = 'd'
        break
        case 'a':
        keys.a.pressed = true
        lastKey = 'a'
        break
        case 'w':
        if (player.velocity.y === 0) keys.w.pressed = player.velocity.y = -12
        break
    }
    console.log(event.key)
})

window.addEventListener('keyup', (event) =>{
    switch(event.key) {
        case 'd':
        keys.d.pressed = false
        break
        case 'a':
        keys.a.pressed = false
        break
        case 'w':
        keys.w.pressed = false
        break
    }
    console.log(event.key)
})


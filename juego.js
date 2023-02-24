const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1500
canvas.height = 765

const gravity = 1

class Player {
    constructor(position) {
        this.position = position
        this.velocity = {
            x: 0,
            y: 1,
        }
        this.height = 100
    }

     draw() {
        c.fillStyle = 'red'
        c.fillRect (this.position.x, this.position.y, 100, this.height)
     }

     update () {
        this.draw()

        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if (this.position.y + this.height + this.velocity.y < canvas.height) 
        this.velocity.y += gravity
        else this.velocity.y = 0
     }
}

const player = new Player({
    x: 0,
    y: 0,
})
const player2 = new Player({
    x: 300,
    y: 100,
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

function animate () {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'white'
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.update()
    player2.update()

    player.velocity.x = 0
    if(keys.d.pressed && lastKey === 'd') player.velocity.x = 5
    else if (keys.a.pressed && lastKey === 'a') player.velocity.x = -5
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
        if (player.velocity.y === 0) keys.w.pressed = player.velocity.y = -20
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


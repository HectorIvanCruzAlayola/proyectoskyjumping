const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')



canvas.width = 1420
canvas.height = 750


const scaledCanvas = {
  width: canvas.width / 4.8,
  height: canvas.height / 4.8,
}

const floorCollisions2D = []
for (let i = 0; i < floorCollisions.length; i += 65) {
  floorCollisions2D.push(floorCollisions.slice(i, i + 65))
}

const collisionBlocks = []
floorCollisions2D.forEach((row, y) => {
  row.forEach((symbol, x) => {
    if (symbol === 574 || symbol === 324) {
      collisionBlocks.push(
        new CollisionBlock({
          position: {
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
    if (symbol === 324) {
      platformCollisionBlocks.push(
        new CollisionBlock({
          position: {
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
    x: 175,
    y: 350,
  },
  level: 1,
  collisionBlocks,
  platformCollisionBlocks,
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



const keys = {
  d: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
}

const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: 'img/fondonuevos.png',
})

const backgroundImageHeight = 436

const camera = {
  position: {
    x: 0,
    y: -backgroundImageHeight + scaledCanvas.height,
  },
}

function animate() {
  if (!isPaused) {
    window.requestAnimationFrame(animate)
  }

  c.fillStyle = 'white'
  c.fillRect(0, 0, canvas.width, canvas.height)

  c.save()
  c.scale(2.1, 2.1)
  c.translate(camera.position.x, camera.position.y)
  background.update()

  // collisionBlocks.forEach((collisionBlock) => {
  //   collisionBlock.update()
  // })

  // platformCollisionBlocks.forEach((block) => {
  //   block.update()
  // })

  
  player.checkForHorizontalCanvasCollision()
  player.update()
  player.velocity.x = 0
  if (keys.d.pressed) {
    player.switchSprite('Run')
    player.velocity.x = 2
    player.lastDirection = 'right'
    player.shouldPanCameraToTheLeft({ canvas, camera })
  } else if (keys.a.pressed) {
    player.switchSprite('RunLeft')
    player.velocity.x = -2
    player.lastDirection = 'left'
    player.shouldPanCameraToTheRight({ canvas, camera })
  } else if (player.velocity.y === 0) {
    if (player.lastDirection === 'right') player.switchSprite('Idle')
    else player.switchSprite('IdleLeft')
  }
  if (player.velocity.y < 0) {
    player.shouldPanCameraDown({ camera, canvas })
    if (player.lastDirection === 'right') player.switchSprite('Jump')
    else player.switchSprite('JumpLeft')
  } else if (player.velocity.y > 0) {
    player.shouldPanCameraUp({ camera, canvas })
    if (player.lastDirection === 'right') player.switchSprite('Fall')
    else player.switchSprite('FallLeft')
  }

  c.restore()
}

const pauseBtn = document.getElementById('pauseBtn')
const resumeBtn = document.getElementById('resumeBtn')
const restartBtn = document.getElementById('restartBtn')
let isPaused = false

pauseBtn.addEventListener('click', () => {
  isPaused = true
  pauseBtn.disabled = true
  resumeBtn.disabled = false
})

resumeBtn.addEventListener('click', () => {
  isPaused = false
  animate()
  pauseBtn.disabled = false
  resumeBtn.disabled = true
})

restartBtn.addEventListener('click', () => {
  window.location.reload()
})



animate()


window.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'd':
      keys.d.pressed = true
      break
    case 'a':
      keys.a.pressed = true
      break
    case 'w':
      if (player.velocity.y === 0) keys.w.pressed = player.velocity.y = -14
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


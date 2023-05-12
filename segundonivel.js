
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1420
canvas.height = 750

const scaledCanvas = {
  width: canvas.width / 4.8,
  height: canvas.height / 4.8,
}


const floorCollisions2DLevel2 = []
for (let i = 0; i < floorCollisionsLevel2.length; i += 65) {
  floorCollisions2DLevel2.push(floorCollisionsLevel2.slice(i, i + 65))
}

const collisionBlocks = []
floorCollisions2DLevel2.forEach((row, y) => {
  row.forEach((symbol, x) => {
    if (symbol === 11355) { // 
      collisionBlocks.push(
        new CollisionBlock({
          symbol: symbol,
          block_type: "puerta", 
          position: {
            x: x * 16,
            y: y * 16,
          },
        })
      )
    }
    if (symbol === 11298) {
      collisionBlocks.push(
        new CollisionBlock({
          symbol: symbol,
          block_type: "pinchos", 
          position: {
            x: x * 16,
            y: y * 16,
          },
        })
      )
    }
    if (symbol === 11297) { // 
      collisionBlocks.push(
        new CollisionBlock({
          symbol: symbol, 
          position: {
            x: x * 16,
            y: y * 16,
          },
        })
      )
    }
  })
})
  

const platformCollisions2DLevel2 = []
for (let i = 0; i < platformCollisionsLevel2.length; i += 65) {
  platformCollisions2DLevel2.push(platformCollisionsLevel2.slice(i, i + 65))
}

const platformCollisionBlocks = []
platformCollisions2DLevel2.forEach((row, y) => {
  row.forEach((symbol, x) => {
    if (symbol === 11627) {
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

let lives = 3
let gameOver = false;


const gravity = 1

const player = new Player({
  position: {
    x: 175,
    y: 700,
  },  

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
  w: {
    pressed: false,
  },
}

const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: 'img/segundonivel.png',
})

const backgroundImageHeight = 436

const camera = {
  position: {
    x: 0,
    y: -backgroundImageHeight + scaledCanvas.height,
  },
}

function animate() {
  if (gameOver) {
    return;
  }

  if (!isPaused) {
    window.requestAnimationFrame(animate)
  }

  c.fillStyle = 'white'
  c.fillRect(0, 0, canvas.width, canvas.height)
  c.save()
  // c.scale(2.1, 2.1)


  c.translate(camera.position.x, camera.position.y)
  background.update()


  player.checkForHorizontalCanvasCollision()
  

  // Detectar colision con puerta 732
  // collisionBlocks.forEach(block => {
  //  if (block.symbol === 732 && detectCollision(player, block)) {
  //    console.log("Collision detected with door", block)
  //    window.location.href = 'segundonivel.html'
  //    return
  //  }
  // })

  if (player.door === true) {
    localStorage.setItem('lives', lives);
    window.location.href = 'segundonivel.html'
    player.door = false
  } 


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


  if (player.position.y > canvas.height || player.pmuerte === true) {
    lives--;
    document.getElementById("lives").textContent = "Vidas: " + lives;
    player.pmuerte = false
    if (lives <= 0) {
      gameOver = true
      const gameOverMsg = document.createElement("h1");
      gameOverMsg.textContent = "Game Over";
      gameOverMsg.style.color = "white"; 
      document.getElementById("game-container").appendChild(gameOverMsg);
      document.getElementById("pauseBtn").disabled = true;
      document.getElementById("resumeBtn").disabled = true;
    } else {
      player.position.x = 175;
      player.position.y = 350;
      camera.position.x = 0;
      camera.position.y = -backgroundImageHeight + scaledCanvas.height;
    }
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
      if (player.velocity.y === 0) keys.w.pressed = player.velocity.y = -13
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


// Detector nuevo de puerta renovada 
// function detectCollision(player, block) {
//  return collision({
//    object1: player.hitbox,
//    object2: block,
//  })
// }











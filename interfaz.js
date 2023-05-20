const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

const startBtn = document.getElementById('startBtn')
const backgroundSound = new Audio('sonidos/musicainterfaz.mp3');


backgroundSound.addEventListener('ended', function() {
  this.currentTime = 0; 
  this.play();
});

canvas.width = 1420
canvas.height = 750


const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: 'img/interfaz1.jpg',
})

const backgroundImageHeight = 436


window.addEventListener('keydown', (event) => {
    switch (event.key) {     
      case ' ':
            window.location.href = "primernivel.html"
        break;
    }
  });


function animate() {

  window.requestAnimationFrame(animate)
  c.fillStyle = 'white'
  c.fillRect(0, 0, canvas.width, canvas.height)
  c.save()

  background.update()
  
  c.restore()  

  if (Math.floor(Date.now() / 650) % 2 === 0) { // Cambio cada 500 milisegundos
    startBtn.style.visibility = 'hidden' // Oculta el texto
  } else {
    startBtn.style.visibility = 'visible' // Muestra el texto
  }

}


animate()
backgroundSound.play()




  















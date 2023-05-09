class CollisionBlock {
  constructor({ symbol, position, height = 16 }) {
    this.symbol = symbol // Initialize the symbol to 0, so that it exists
    this.position = position
    this.width = 16
    this.height = height
  }
  
  getBoundingBox() {
    return {
      x: this.position.x,
      y: this.position.y,
      width: this.width,
      height: this.height,
    }
  }

  draw() {
    c.fillStyle = 'rgba(255, 0, 0, 0.5)'
    c.fillRect(this.position.x, this.position.y, this.width, this.height)
  }

  update() {
    this.draw()
  }
}


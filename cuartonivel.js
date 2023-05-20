const block_ids = { //if not any of these, then "suelo" // add strings to the collisionblocks
    "puerta":  3,
    "pinchos": 1,
  }
  
  const scaling = 3.5 // modify per level xd 
  const player_coords = [10, 350]
  const background_image_height = 436
  
  
  const nivel = new Level(3, block_ids, scaling, player_coords, background_image_height) // part constructor variable replace
  
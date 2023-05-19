const block_ids = { //if not any of these, then "suelo" // add strings to the collisionblocks
    "puerta":  3,
    "pinchos": 1,
  }
  
  const scaling = 1.8 // modify per level xd 
  const player_coords = [-10, 20]
  const background_image_height = 436
  
  
  const nivel = new Level(2, block_ids, scaling, player_coords, background_image_height) // part constructor variable replace
  
const block_ids = { //if not any of these, then "suelo" // add strings to the collisionblocks
    "puerta":  275,
    "pinchos": 274,
}

const scaling = 4.8 // modify per level xd 
const player_coords = [175, 550] 
const background_image_height = 436


const nivel = new Level(0, block_ids, scaling, player_coords, background_image_height) // part constructor variable replace

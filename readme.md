# Tic Tac Toe

My take on the classic board game using the revealing module pattern.

## Technologies Used
- [Bootstrap](https://getbootstrap.com)
- [Gulp](http://gulpjs.com/)
- [Browserify](http://browserify.org/)
- [Underscore](http://underscorejs.org/)
- [Mocha](https://mochajs.org/)

## Requirements
- [Node](https://nodejs.org/en/)
- [npm](https://www.npmjs.com/)

## How to run the app
- Clone this repository
- Install dependencies: `$ npm install`
- Run: `gulp serve`
- Visit: [http://localhost:3000](http://localhost:3000) in your browser

## Deployment
This app is static and does not require Node.js to run. Simply deploy the following files and directories to your server:

    index.html
    /static
        /images
        /css
        /js/dist
            common.min.js
            game.min.js

## Working with the code
The main JavaScript file for the game is at `/static/js/src/game.js`. Gulp is used to process this file as changes are made passing it through a few tasks to Browserify the file, minify, uglify and create a source map.

Gulp watch is used to monitor changes to JavaScript and Less files. The default Gulp task will start the watchers and process files. Simply run:

    $ gulp

from the project root and watch the magic. The default task also starts up `gulp-serve` so you can view changes at http://localhost:3000

## Tests

Functional tests are provided via Mocha in the `/tests` directory. You may run them via:

    $ gulp test

## How the Game Works

The game "board" is comprised of 9 "positions" in a 3 x 3 x 3 grid.

| 1 | 2 | 3 |
| - | - | - |
| **4** | **5** | **6** |
| **7** | **8** | **9** |

There are 8 possible combinations along the vertical, horizontal or diagonal axis that constitute a "win".

    [
        // horizontal
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],

        // vertical
        [1, 4, 7],
        [2, 5, 8],
        [3, 6, 9],

        // diagonal
        [1, 5, 9],
        [3, 5, 7]
    ]

 When the game is initialized the human player goes first, and may choose any position, which is pushed to the `player.positions` array.

 The AI determines its next move in this order:

Examine the player's positions and determine which winning combinations have the fewest number of remaining moves.
- Are there are two open positions in any combo?
    - Yes
        - Is this the AI's first turn?
            - Yes
                - Has the player chosen the middle space on his or her first move?
                    - Yes. Pick a corner: 1, 3, 7 or 9.
                    - No. Pick the middle position, 5.
            - No
                - Is the middle space available?
                    - Yes. Pick the middle position.
                    - Pick at random.
    - No
        - Does the AI only need one more position to win?
            - Yes. Choose the winning space
            - No. Choose the position that will block the player's winning combo

The AI will then push the selected position into its own `.positions` array. The active player is toggled, and control is returned to the human player.

This process continues until either player has positions that comprise a winning combination, or all positions are exhausted.

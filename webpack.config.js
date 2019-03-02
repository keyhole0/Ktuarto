const path = require('path');

module.exports = {
  entry:{
    main:'./src/index.js',
    'worker/choice':'./src/javascript/quarto/gamesys/worker/choice.js',
    'worker/put':'./src/javascript/quarto/gamesys/worker/put.js',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'docs')
  }
};
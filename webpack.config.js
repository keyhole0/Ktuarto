const path = require('path');

module.exports = {
  entry:{
    index:'./src/index.js',
    'worker/choice':'./src/js/quarto/gamesys/worker/choice.js',
    'worker/put':'./src/js/quarto/gamesys/worker/put.js',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'docs')
  },
  module:{
    rules:[
      {test:/\.png$/, loader:'file-loader', query:{name:'img/[name].[ext]'}}
      
    ]
  }
};
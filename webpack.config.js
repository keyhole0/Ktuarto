const path = require('path');

module.exports = {
  entry:{
    main:'./src/index.js',
    worker:'./src/javascript/worker/worker.js',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'docs')
  }
};
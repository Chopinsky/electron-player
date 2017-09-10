const loader = require('./main/electron-loader');
const path = require('path');

loader(path.join(__dirname, 'dist', 'index.html'));
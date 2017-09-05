const path = require('path');
const url = require('url');
const electron = require('electron');

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

// import config file
//const config = store.parseDataFile('./config/app.config');
const config = { 'width': 1024, 'height': 768 }

// save off global reference to the main window
let mainWindow;

const createWindow = () => {
  mainWindow =  new BrowserWindow({
    "width": config.width || 1024,
    "height": config.height || 768,
    "mini-width": 360,
    "mini-height": 240,
    "backgroundColor": config.background || "#585858"
  });

  if (process.env.DEBUG) {
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadURL(url.format({
      "pathname": path.join(__dirname, 'build', 'index.html'),
      "protocol": 'file:',
      "slashes": true
    }));
  }

  mainWindow.setMenu(null);

  mainWindow.on('resize', () => {
    let { width, height } = mainWindow.getBounds();
    config.width = width;
    config.height = height;
  });

  mainWindow.on('closed', () => {
    //store.saveToDataFile(config, path.join(__dirname, 'config/', 'app.config'));
    mainWindow = null;
  });
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
      app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

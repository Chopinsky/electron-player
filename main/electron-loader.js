const path = require('path');
const fs = require('fs');
const url = require('url');
const electron = require('electron');
const ipcMain = electron.ipcMain;

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

// import config file
//const config = store.parseDataFile('./config/app.config');
const config = { 'width': 1024, 'height': 768 };

// save off global reference to the main window
let mainWindow;

const createWindow = (contentPath) => {
  mainWindow = new BrowserWindow({
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
    mainWindow.webContents.openDevTools();
    mainWindow.loadURL(url.format({
      "pathname": contentPath, //path.join(__dirname, 'dist', 'index.html'),
      "protocol": 'file',
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

const ipcHandler = (event, arg) => {
  console.log(arg);
  setTimeout((event) => {
    event.sender.send('asynchronous-reply', 'pong');
  }, 1000, event);
};

module.exports = (contentPath) => {
  if (!contentPath || !fs.existsSync(contentPath)) {
    console.log('Failed to load the content... exiting...');
    return;
  }

  app.on('ready', () => createWindow(contentPath));
  
  // creating IPC communication
  ipcMain.on('asynchronous-message', (event, arg) => ipcHandler(event, arg));
  
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
}
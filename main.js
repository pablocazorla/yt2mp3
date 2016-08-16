const electron = require('electron');
// Module to control application life.
const {
  app
} = electron;
// Module to create native browser window.
const {
  BrowserWindow
} = electron;

const ipc = require('electron').ipcMain;

const dialog = require('electron').dialog;

const fs = require('fs');

const Menu = electron.Menu;

//
let template = [];
const name = electron.app.getName()
template.push({
  label: name,
  submenu: [{
    label: 'Services',
    role: 'services',
    submenu: []
  }, {
    type: 'separator'
  }, {
    label: `Hide ${name}`,
    accelerator: 'Command+H',
    role: 'hide'
  }, {
    label: 'Hide Others',
    accelerator: 'Command+Alt+H',
    role: 'hideothers'
  }, {
    label: 'Show All',
    role: 'unhide'
  }, {
    type: 'separator'
  }, {
    label: 'Quit',
    accelerator: 'Command+Q',
    click: function() {
      app.quit()
    }
  }]
});



let win;

function createWindow() {

  const {
    width,
    height
  } = electron.screen.getPrimaryDisplay().workAreaSize;

  var w = Math.round(0.9 * width),
    h = Math.round(0.9 * height),
    mw = 1024,
    mh = 600;

  w = (w < mw) ? mw : w;
  h = (h < mh) ? mh : h;

  win = new BrowserWindow({
    'width': w,
    'height': h,
    'minWidth': mw,
    'minHeight': mh
  });
  win.loadURL(`file://${__dirname}/index.html`);


if (process.platform === 'darwin') {
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}else{
  win.setMenu(null);
}
  // Open the DevTools.
  // 
  win.webContents.openDevTools();

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.// APP


ipc.on('open-file-dialog', function(event) {
  dialog.showOpenDialog({
    title: 'Save mp3 in',
    properties: ['openDirectory']
  }, function(files) {
    if (files) event.sender.send('selected-directory', files);
  })
})
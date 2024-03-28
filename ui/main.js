const { app, BrowserWindow } = require('electron');

function createWindow() {
    const app = new BrowserWindow({
        width: 1366,
        height: 768,
        backgroundColor: "white",
        webPreferences: {
            nodeIntegration: false,
            worldSafeExecuteJavaScript: true,
            contextIsolation: true,
        }
    })

    app.loadURL('http://localhost:3000')
}

app.whenReady().then(createWindow)


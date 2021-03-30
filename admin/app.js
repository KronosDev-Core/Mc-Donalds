const { app, BrowserWindow } = require('electron');
const shell = require('shelljs'),
    https = require('https');


let show = false;

shell.exec('npm run start_server', (code, stdout, stderr) => {
    console.log('Exit code:', code);
    console.log('Program output:', stdout);
    console.log('Program stderr:', stderr);
});

function createWindow() {
    let win = new BrowserWindow({
        width: 800,
        height: 600,
        frame: false,
        show: false,
        webPreferences: {
            nodeIntegration: true,
            nodeIntegrationInWorker: true,
            enableRemoteModule: false
        }
    });

    win.loadURL('https://kronos.dev:443/');
    //win.setMenu(null);
    win.maximize();
    win.setResizable(true);
    win.removeMenu();
    win.webContents.openDevTools()
    win.webContents.on('before-input-event', (event, input) => {
        if (input.alt && input.key.toLowerCase() === 'q') {
            app.quit();
            event.preventDefault()
        }
    });

    win.once('ready-to-show', () => {
        setInterval(() => {
            if (!show) {
                https.request({ method: 'GET', host: 'kronos.dev', port: 443, path: '/' }, (res) => {
                    console.log(`Json Request : ${JSON.stringify(res.statusCode)}`);
                    win.show();
                    show = true;
                });
            };
        }, 2000);
    });
};

app.whenReady().then(createWindow);


app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    };
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    };
});
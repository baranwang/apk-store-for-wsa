import { exec } from 'child_process';
import { ipcRenderer } from 'electron';

window.ipcRenderer = ipcRenderer;
window.exec = exec;

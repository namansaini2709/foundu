// URL replacement utility maintained with the repository.
const fs = require('fs');
const path = require('path');

const BACKEND_DIR = 'c:/All vs code projects/foundU/FoundUU/foundu/backend';
const FRONTEND_DIR = 'c:/All vs code projects/foundU/FoundUU/foundu/frontend/foundu/src';

function walk(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        if (isDirectory) walk(dirPath, callback);
        else callback(path.join(dir, f));
    });
}

// 1. Backend: replace http://localhost:5173 with ${process.env.FRONTEND_URL || 'http://localhost:5173'}
const backendReplaces = 0;
walk(BACKEND_DIR, (filePath) => {
    if (!filePath.endsWith('.js')) return;
    if (filePath.includes('node_modules')) return;
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Handle "http://localhost:5173/..."
    content = content.replace(/"http:\/\/localhost:5173([^"]*)"/g, "`${process.env.FRONTEND_URL || 'http://localhost:5173'}$1`");
    // Handle `http://localhost:5173/...`
    content = content.replace(/`http:\/\/localhost:5173([^`]*)`/g, "`${process.env.FRONTEND_URL || 'http://localhost:5173'}$1`");

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Fixed backend:', filePath);
    }
});

// 2. Frontend: replace http://localhost:4000 with ${import.meta.env.VITE_API_URL || 'http://localhost:4000'}
walk(FRONTEND_DIR, (filePath) => {
    if (!filePath.endsWith('.js') && !filePath.endsWith('.jsx')) return;
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    content = content.replace(/"http:\/\/localhost:4000([^"]*)"/g, "`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}$1`");
    content = content.replace(/'http:\/\/localhost:4000([^']*)'/g, "`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}$1`");
    content = content.replace(/`http:\/\/localhost:4000([^`]*)`/g, "`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}$1`");

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Fixed frontend:', filePath);
    }
});

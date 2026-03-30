import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pagesDir = path.join(__dirname, 'src', 'pages');

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (stat.isFile() && fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Remove import statement
      content = content.replace(/import\s+Navbar\s+from\s+["'].*?(?:\/|\\)components(?:\/|\\)Navbar["'];?\n?/g, '');
      
      // Remove JSX tag <Navbar />
      content = content.replace(/<Navbar\s*\/?>(?:\s*<\/Navbar>)?/g, '');
      
      // Also remove empty lines that might have been left
      content = content.replace(/^\s*$(?:\r\n?|\n)/gm, '\n');
      
      fs.writeFileSync(fullPath, content);
      console.log(`Processed: ${file}`);
    }
  }
}

console.log('Starting Navbar removal process...');
processDirectory(pagesDir);
console.log('Done.');

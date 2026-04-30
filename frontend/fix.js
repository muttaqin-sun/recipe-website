const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.js') || fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let originalContent = content;

      // Fix 1: <Link to= -> <Link href=
      content = content.replace(/<Link\s+to=/g, '<Link href=');

      // Fix 2: navigate(...) -> navigate.push(...)
      // Since it's usually `navigate('/path')` or `navigate(\`something\`)` we just replace navigate(
      // But only if it's a function call, not the declaration `const navigate`
      // We can use a regex to look for navigate(
      content = content.replace(/\bnavigate\(/g, 'navigate.push(');

      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Fixed: ${fullPath}`);
      }
    }
  }
}

// Start processing from frontend/src
processDir(path.join(__dirname, 'src'));
console.log('Done processing fixes.');

const fs = require('fs');
const path = require('path');

function fixImports(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      fixImports(fullPath);
    } else if (fullPath.endsWith('.js') || fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Specifically target imports starting with relative dots leading to components, context, or data
      const regex = /from\s+['"](\.\.\/)+((components|context|data).*?)['"]/g;
      
      const newContent = content.replace(regex, "from '@/$2'");

      // Also handle ../ for depth 1 just in case it is from '../components'
      const regex2 = /from\s+['"]\.\/((components|context|data).*?)['"]/g;
      const newContent2 = newContent.replace(regex2, "from '@/$1'");

      if (content !== newContent2) {
        fs.writeFileSync(fullPath, newContent2, 'utf8');
        console.log(`Fixed imports in: ${fullPath}`);
      }
    }
  }
}

fixImports(path.join(__dirname, 'src', 'app'));
console.log('Import aliasing fix complete.');

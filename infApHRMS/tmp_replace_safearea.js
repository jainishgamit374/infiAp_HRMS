const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('SafeAreaView')) {
        let originalContent = content;
        
        // Remove SafeAreaView from react-native imports
        content = content.replace(/import\s+{([^}]*)}\s+from\s+['"]react-native['"];/g, (match, p1) => {
           let imports = p1.split(',').map(s => s.trim()).filter(Boolean);
           if (imports.includes('SafeAreaView')) {
             imports = imports.filter(i => i !== 'SafeAreaView');
             if (imports.length === 0) return '';
             return `import { ${imports.join(', ')} } from 'react-native';`;
           }
           return match;
        });

        // Add SafeAreaView from react-native-safe-area-context
        if (content !== originalContent && !content.includes('react-native-safe-area-context')) {
           // Find the last import statement
           const importRegex = /import\s+.*from\s+['"].*['"];\n/g;
           let lastMatchIndex = 0;
           let match;
           while ((match = importRegex.exec(content)) !== null) {
              lastMatchIndex = match.index + match[0].length;
           }
           if (lastMatchIndex > 0) {
              content = content.slice(0, lastMatchIndex) + "import { SafeAreaView } from 'react-native-safe-area-context';\n" + content.slice(lastMatchIndex);
           } else {
              content = "import { SafeAreaView } from 'react-native-safe-area-context';\n" + content;
           }
        }
        
        if (content !== originalContent) {
           fs.writeFileSync(fullPath, content);
           console.log('Fixed', fullPath);
        }
      }
    }
  }
}

processDir('/Users/jainishgamit/Downloads/infiAp/infApHRMS/app');
processDir('/Users/jainishgamit/Downloads/infiAp/infApHRMS/components');

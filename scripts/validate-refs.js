const fs = require('fs');
const path = require('path');
const refsDir = path.join(__dirname, '..', 'thriller-writing', 'references');
const files = fs.readdirSync(refsDir).filter(f => f.endsWith('.md'));
if (files.length < 10) {
  console.error('FAIL: only ' + files.length + ' reference files, expected 10+');
  process.exit(1);
}
console.log('PASS: ' + files.length + ' thriller reference files found');
const ifDir = path.join(__dirname, '..', 'interactive-fiction', 'references');
const ifFiles = fs.readdirSync(ifDir).filter(f => f.endsWith('.md'));
if (ifFiles.length < 8) {
  console.error('FAIL: only ' + ifFiles.length + ' IF reference files, expected 8+');
  process.exit(1);
}
console.log('PASS: ' + ifFiles.length + ' interactive fiction reference files found');
console.log('ALL CHECKS PASSED');

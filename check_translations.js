const fs = require('fs');

const poFile = 'languages/maxi-blocks-ja.po';
const content = fs.readFileSync(poFile, 'utf8');
const lines = content.split('\n');

let msgid = '';
let lineNum = 0;
let missingCount = 0;

console.log('Checking for missing translations...');

const output = [];

for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('msgid "')) {
        msgid = line.substring(7, line.length - 1);
    } else if (line.startsWith('msgstr ""') && msgid) {
        let isEmpty = true;
        if (i + 1 < lines.length) {
            const nextLine = lines[i+1].trim();
            if (nextLine.startsWith('"')) {
                isEmpty = false;
            }
        }
        
        if (isEmpty) {
            output.push(`Line ${i+1}: ${msgid}`);
            missingCount++;
        }
    }
}

console.log(`Total missing translations: ${missingCount}`);
fs.writeFileSync('languages/missing_translations_ja.txt', output.join('\n'));
console.log('Written to languages/missing_translations_ja.txt');

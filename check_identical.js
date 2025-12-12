const fs = require('fs');
const path = require('path');

const poFilePath = path.join(__dirname, 'languages', 'maxi-blocks-ja.po');
const content = fs.readFileSync(poFilePath, 'utf8');
const lines = content.split('\n');

let msgid = null;
let msgidLine = 0;
let identicalCount = 0;

console.log("Checking for identical msgid and msgstr...");

for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('msgid "')) {
        msgid = line.substring(7, line.length - 1);
        msgidLine = i + 1;
    } else if (line.startsWith('msgstr "') && msgid !== null) {
        const msgstr = line.substring(8, line.length - 1);
        if (msgid === msgstr && msgid.length > 0) {
            // Ignore some common ones that might be identical like punctuation or names if appropriate, 
            // but usually they should be different or at least reviewed.
            // Filtering out very short ones or numbers might be good, but let's list them.
            if (!/^\d+$/.test(msgid) && msgid.length > 3) {
                 console.log(`Line ${msgidLine}: Identical translation for "${msgid}"`);
                 identicalCount++;
            }
        }
        msgid = null;
    }
}

console.log(`Found ${identicalCount} identical translations (excluding short/numeric).`);

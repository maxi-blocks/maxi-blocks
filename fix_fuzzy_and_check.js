const fs = require('fs');
const path = require('path');

const poFilePath = path.join(__dirname, 'languages', 'maxi-blocks-ja.po');
let content = fs.readFileSync(poFilePath, 'utf8');

// Count fuzzies
const fuzzyMatch = content.match(/^#, fuzzy/gm);
console.log(`Found ${fuzzyMatch ? fuzzyMatch.length : 0} fuzzy markers.`);

// Remove fuzzy markers
// We also want to remove lines starting with "#| msgid" which often follow fuzzy markers
// But simply removing "#, fuzzy" is usually enough to make it active.
// Let's remove "#, fuzzy\n"
content = content.replace(/^#, fuzzy\r?\n/gm, '');

fs.writeFileSync(poFilePath, content);
console.log("Removed fuzzy markers.");

// Now check for identicals again and save to file
const lines = content.split('\n');
let msgid = null;
let msgidLine = 0;
let identicals = [];

for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('msgid "')) {
        msgid = line.substring(7, line.length - 1);
        msgidLine = i + 1;
    } else if (line.startsWith('msgstr "') && msgid !== null) {
        const msgstr = line.substring(8, line.length - 1);
        if (msgid === msgstr && msgid.length > 0) {
            // Filter short/numeric
             if (!/^\d+$/.test(msgid) && msgid.length > 3) {
                 identicals.push({line: msgidLine, text: msgid});
            }
        }
        msgid = null;
    }
}

const reportPath = path.join(__dirname, 'identical_translations_report.txt');
let reportContent = "Identical Translations:\n";
identicals.forEach(item => {
    reportContent += `Line ${item.line}: "${item.text}"\n`;
});
fs.writeFileSync(reportPath, reportContent);
console.log(`Written ${identicals.length} identical translations to ${reportPath}`);

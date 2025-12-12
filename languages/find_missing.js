const fs = require('fs');
const content = fs.readFileSync('c:/Users/kyra/maxi-blocks/languages/maxi-blocks-ja.po', 'utf8');
const lines = content.split('\n');
const missing = [];

for (let index = 0; index < lines.length; index++) {
    const line = lines[index];
    if (line.trim() === 'msgstr ""') {
        // Look backwards for msgid
        let i = index - 1;
        let msgid = '';
        while (i >= 0) {
            const l = lines[i].trim();
            if (l.startsWith('msgid ')) {
                msgid = l.substring(6);
                // Handle basic quoted string
                if (msgid.startsWith('"') && msgid.endsWith('"')) {
                    msgid = JSON.parse(msgid); // robust unquote
                }
                
                // If msgid is empty string, check previous line
                // But PO format usually puts `msgid ""` then newline then strings for multiline headers.
                // We are looking for simple msgids first.
                
                break;
            }
            i--;
        }
        
        // Filter out header
        if (msgid !== "" && !msgid.includes('Project-Id-Version')) {
             missing.push({ line: index + 1, msgid: msgid });
        }
    }
}

fs.writeFileSync('c:/Users/kyra/maxi-blocks/languages/missing_entries.json', JSON.stringify(missing, null, 2));
console.log('Written ' + missing.length + ' entries to missing_entries.json');

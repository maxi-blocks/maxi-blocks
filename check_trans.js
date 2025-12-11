const fs = require('fs');
const path = 'languages/maxi-blocks-pl_PL.po';

try {
  const content = fs.readFileSync(path, 'utf8');
  const lines = content.split('\n');
  let currentMsgid = null;
  let total = 0;
  let identical = 0;
  let untranslated = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('msgid "')) {
      currentMsgid = line.substring(7, line.length - 1);
    } else if (line.startsWith('msgstr "') && currentMsgid !== null) {
      const msgstr = line.substring(8, line.length - 1);
      if (currentMsgid) { // ignore empty msgid (header)
        total++;
        if (!msgstr) {
          untranslated++;
        } else if (msgstr === currentMsgid) {
          identical++;
        }
      }
      currentMsgid = null;
    }
  }

  console.log(`Total: ${total}`);
  console.log(`Empty: ${untranslated}`);
  console.log(`Identical (English): ${identical}`);
} catch (e) {
  console.error(e);
}

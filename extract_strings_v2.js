const fs = require('fs');
const path = 'languages/maxi-blocks-pl_PL.po';

try {
  const content = fs.readFileSync(path, 'utf8');
  const lines = content.split('\n');
  let currentMsgid = null;
  let untranslated = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('msgid "')) {
      currentMsgid = line.substring(7, line.length - 1);
    } else if (line.startsWith('msgstr "') && currentMsgid !== null) {
      const msgstr = line.substring(8, line.length - 1);
      // Check if untranslated (empty or identical to msgid)
      // Note: We ignore empty msgid (header)
      if (currentMsgid && (!msgstr || msgstr === currentMsgid)) {
        untranslated.push(currentMsgid);
      }
      currentMsgid = null;
    }
  }

  fs.writeFileSync('untranslated.json', JSON.stringify(untranslated, null, 2));
  console.log('Extracted ' + untranslated.length + ' strings.');
} catch (e) {
  console.error(e);
}

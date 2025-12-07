const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const locale = 'pl_PL';
const poFile = path.join(__dirname, `maxi-blocks-${locale}.po`);

// Scripts config matching PHP generator
const scripts = {
    'index': {
        'path': 'maxi-blocks/build/index.min.js',
        'name': 'Editor (index.min.js)'
    },
    'admin': {
        'path': 'maxi-blocks/build/admin.min.js',
        'name': 'Dashboard (admin.min.js)'
    },
    'starter-sites': {
        'path': 'maxi-blocks/core/admin/starter-sites/build/js/main.js',
        'name': 'Starter Sites (main.js)'
    }
};

function parsePoFile(content) {
    const lines = content.split('\n');
    const translations = {};
    let isJsFile = false;
    let msgid = null;
    let msgstr = null;
    let inMsgid = false;
    let inMsgstr = false;
    let pluralForms = 'nplurals=2; plural=n != 1;';

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        // Detect Plural-Forms in header
        if (msgid === '' && line.startsWith('"Plural-Forms:')) {
             const match = line.match(/"Plural-Forms: (.*)\\n"/);
             if (match) pluralForms = match[1];
        }

        // Check for source reference with .js/.jsx
        if (line.startsWith('#:') && (line.includes('.js') || line.includes('.jsx'))) {
            isJsFile = true;
            // We continue here, but isJsFile flag persists for the UPCOMING msgid entry
            continue;
        }

        // Handle string continuations
        if (line.startsWith('"') && !line.startsWith('msgid') && !line.startsWith('msgstr') && !line.startsWith('Plural-Forms')) {
             let contentStr = '';
             try {
                 // Try to handle simple quotes removal
                 if (line.length >= 2) {
                    contentStr = line.substring(1, line.length - 1);
                    // Handle escaped quotes unescaping if needed, but for now simple substring
                    contentStr = contentStr.replace(/\\"/g, '"').replace(/\\\\/g, '\\');
                 }
             } catch (e) {}

             if (inMsgid) msgid += contentStr;
             if (inMsgstr) msgstr += contentStr;
             continue;
        }

        if (line.startsWith('msgid "')) {
            // Save previous entry if valid
            if (msgid !== null && msgstr !== null && isJsFile) {
                translations[msgid] = [msgstr];
            }
            
            // Start new entry
            msgid = line.substring(7, line.length - 1);
            msgid = msgid.replace(/\\"/g, '"').replace(/\\\\/g, '\\');
            
            inMsgid = true;
            inMsgstr = false;
            // IMPORTANT: We do NOT reset isJsFile here. It accumulates from preceding #: lines.
            // If there were no #: lines for this entry, isJsFile remains whatever it was?
            // NO. We must reset isJsFile at the END of an entry.
            // The PHP script does it on empty lines.
            // If we didn't hit an empty line, but hit msgid directly?
            // The PHP script: if we hit msgid, it saves previous.
            // It assumes previous had isJsFile set correctly.
            // But what about CURRENT entry?
            // If current entry had no #: lines, isJsFile should be false.
            // So we should reset isJsFile = false somewhere.
            // BUT strict PO files have empty lines.
            // If they don't, we have a problem.
            
            // Wait, if I reset isJsFile = false here, I lose the flag set by #: lines just before!
            // Because #: lines appear BEFORE msgid.
            // So: 
            // 1. Empty line -> Reset isJsFile = false.
            // 2. #: lines -> Set isJsFile = true.
            // 3. msgid -> entry starts. isJsFile is true/false based on step 2.
            
            continue;
        }

        if (line.startsWith('msgstr "')) {
            msgstr = line.substring(8, line.length - 1);
            msgstr = msgstr.replace(/\\"/g, '"').replace(/\\\\/g, '\\');
            inMsgid = false;
            inMsgstr = true;
            continue;
        }

        if (line === '' || line.startsWith('#')) {
            // End of entry (empty line or comment start that isn't #: with js)
            // Note: #: lines were handled above and continue'd.
            
            // Save previous
            if (msgid !== null && msgstr !== null && isJsFile) {
                translations[msgid] = [msgstr];
            }
            
            // Reset state for NEXT entry
            msgid = null;
            msgstr = null;
            isJsFile = false; 
            inMsgid = false;
            inMsgstr = false;
        }
    }
    
    // Last entry
    if (msgid !== null && msgstr !== null && isJsFile) {
         translations[msgid] = [msgstr];
    }
    
    return { translationsResult: translations, pluralFormsResult: pluralForms };
}

console.log(`Reading ${poFile}...`);
if (!fs.existsSync(poFile)) {
    console.error("PO file not found");
    process.exit(1);
}

const poContent = fs.readFileSync(poFile, 'utf8');
const { translationsResult, pluralFormsResult } = parsePoFile(poContent);

console.log(`Found ${Object.keys(translationsResult).length} translations.`);

for (const key in scripts) {
    const script = scripts[key];
    const scriptPath = script.path;
    const hash = crypto.createHash('md5').update(scriptPath).digest('hex');
    const filename = `maxi-blocks-${locale}-${hash}.json`;
    const outputPath = path.join(__dirname, filename);
    
    const localeData = {
        '': {
            'domain': '',
            'lang': locale,
            'plural-forms': pluralFormsResult
        },
        ...translationsResult
    };
    
    const json = {
        'translation-revision-date': new Date().toISOString(),
        'generator': 'MaxiBlocks Node Generator',
        'source': scriptPath.replace('maxi-blocks/', ''),
        'domain': 'maxi-blocks',
        'locale_data': {
            'maxi-blocks': localeData
        }
    };
    
    fs.writeFileSync(outputPath, JSON.stringify(json));
    console.log(`Generated ${filename}`);
}

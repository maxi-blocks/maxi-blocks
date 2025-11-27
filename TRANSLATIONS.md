# JavaScript Translations Setup for MaxiBlocks

## Overview

MaxiBlocks uses a custom solution for JavaScript translations because the bundled `build/index.min.js` file (4.6MB) is too large for WordPress's standard `wp i18n make-json` command to process.

## How It Works

1. **PHP translations** work normally through the `.po` and `.mo` files
2. **JavaScript translations** are extracted from the `.po` file and compiled into a single JSON file
3. The JSON file is manually injected inline before the main script loads

## Files Involved

- `languages/maxi-blocks-de_DE.po` - Master translation file (edit in Loco Translate)
- `languages/maxi-blocks-de_DE.mo` - Compiled PHP translations (auto-generated)
- `languages/maxi-blocks-de_DE-2f2df17011b16d4ca25e596e0409fe72.json` - JavaScript translations
- `generate-translations.php` - Script to generate the JSON file

## Adding/Updating Translations

### 1. Translate strings in Loco Translate
- Go to WordPress Admin → Loco Translate → Plugins → MaxiBlocks
- Select German (de_DE) or your language
- Translate strings as normal
- Click "Save"

### 2. Regenerate the JavaScript JSON file
Run this command from the plugin directory:
```bash
php generate-translations.php
```

This will:
- Parse the `.po` file
- Extract all JavaScript strings (from `.js` files)
- Create/update the JSON file with the correct hash
- Only include translated strings (empty translations are skipped)

### 3. Clear caches
```bash
wp cache flush
```
Then hard-reload the browser (Ctrl+Shift+R)

## Technical Details

### Why the custom solution?

WordPress's `wp_set_script_translations()` doesn't work with large bundled files because:
1. It tries to generate separate JSON files for each source file
2. The bundled file is too large to parse
3. The standard `wp i18n make-json` command times out

### How translations are loaded

In `core/class-maxi-blocks.php` (lines 153-178):
```php
$locale = get_locale();
$json_file = plugin_dir_path(dirname(__FILE__)) . 'languages/maxi-blocks-' . $locale . '-' . md5('maxi-blocks/build/index.min.js') . '.json';

if (file_exists($json_file)) {
    $translations_json = file_get_contents($json_file);
    $translations_data = json_decode($translations_json, true);

    if ($translations_data && isset($translations_data['locale_data'])) {
        wp_add_inline_script(
            'maxi-blocks-block-editor',
            sprintf(
                '( function( domain, translations ) {
                    var localeData = translations.locale_data[ domain ] || translations.locale_data.messages;
                    localeData[""].domain = domain;
                    wp.i18n.setLocaleData( localeData, domain );
                } )( "maxi-blocks", %s );',
                $translations_json
            ),
            'before'
        );
    }
}
```

### JSON file structure

The JSON file follows the JED (Jed Gettext) format:
```json
{
    "translation-revision-date": "2025-11-27 11:51:28+00:00",
    "generator": "MaxiBlocks Translation Script",
    "source": "build/index.min.js",
    "domain": "maxi-blocks",
    "locale_data": {
        "maxi-blocks": {
            "": {
                "domain": "",  // Must be empty string!
                "lang": "de_DE",
                "plural-forms": "nplurals=2; plural=n != 1;"
            },
            "Cloud library Maxi": ["Cloud-Bibliothek Maxi"],
            "Active style card": ["Aktive Stilkarte"]
        }
    }
}
```

**Important:** The `"domain": ""` field in the metadata must be an empty string, not `"maxi-blocks"`.

### The hash calculation

The hash in the filename is calculated as:
```php
md5('maxi-blocks/build/index.min.js')
// Result: 2f2df17011b16d4ca25e596e0409fe72
```

This is the **full relative path from wp-content/plugins/**, not just `build/index.min.js`.

## Troubleshooting

### Translations not showing in JavaScript

1. Check the JSON file exists:
   ```bash
   ls languages/maxi-blocks-de_DE-2f2df17011b16d4ca25e596e0409fe72.json
   ```

2. Verify the JSON is valid:
   ```bash
   cat languages/maxi-blocks-de_DE-2f2df17011b16d4ca25e596e0409fe72.json | python3 -m json.tool
   ```

3. Check the browser console for errors

4. View page source and search for `setLocaleData` - you should see your translations

### Adding a new language

1. Create the language in Loco Translate
2. Translate strings
3. Modify `generate-translations.php` to support the new locale:
   - Update the filename to use the new locale code
   - Or make it accept a parameter for different locales

## For Other Languages

To support multiple languages, you can modify `generate-translations.php` to accept a locale parameter:

```bash
php generate-translations.php de_DE
php generate-translations.php es_ES
php generate-translations.php fr_FR
```

The script would need to be updated to accept `$argv[1]` as the locale.

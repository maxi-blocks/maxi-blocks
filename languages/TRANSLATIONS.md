# JavaScript Translations Setup for MaxiBlocks

## Overview

This custom solution enables integration with translation plugins like Loco Translate, extracting JS translations from `.po` files and injecting them directly into the block editor and dashboard scripts.

## How It Works

1. **PHP translations** work normally through the `.po` and `.mo` files
2. **JavaScript translations** are extracted from the `.po` file and compiled into JSON files (one per bundled script)
3. The JSON files are manually injected inline before each script loads

## Bundled Scripts with Translations

- **`build/index.min.js`** (4.6MB) - Block editor scripts
- **`build/admin.min.js`** (18KB) - Dashboard/admin scripts
- **`core/admin/starter-sites/build/js/main.js`** - Starter Sites library scripts

## Files Involved

- `languages/maxi-blocks-de_DE.po` - Master translation file (edit in Loco Translate)
- `languages/maxi-blocks-de_DE.mo` - Compiled PHP translations (auto-generated)
- `languages/maxi-blocks-de_DE-2f2df17011b16d4ca25e596e0409fe72.json` - Editor JS translations
- `languages/maxi-blocks-de_DE-45dd5f3bbfc23f9c617e432aa6578d60.json` - Dashboard JS translations
- `languages/maxi-blocks-de_DE-a547bf49c483076522aa4a89cde6391f.json` - Starter Sites JS translations
- `generate-translations.php` - Script to generate the JSON files

## Adding/Updating Translations

### 1. Translate strings in Loco Translate
- Go to WordPress Admin → Loco Translate → Plugins → MaxiBlocks
- Select German (de_DE) or your language
- Translate strings as normal
- Click "Save"

### 2. Regenerate the JavaScript JSON files
Run this command from the `languages` directory:
```bash
cd languages
php generate-translations.php
```

This will automatically process all available `.po` files in the languages folder.

Or specify one or more specific locales:
```bash
cd languages
php generate-translations.php es_ES
php generate-translations.php es_ES de_DE fr_FR
```

This will:
- Parse the `.po` file
- Extract all JavaScript strings (from `.js` files)
- Create/update JSON files for `index.min.js`, `admin.min.js`, and `starter-sites/main.js` with the correct hashes
- Only include translated strings (empty translations are skipped)

### 3. Clear caches
```bash
wp cache flush
```
Then hard-reload the browser (Ctrl+Shift+R)

## Technical Details

### Why the custom solution?

WordPress's `wp_set_script_translations()` doesn't work with large bundled files because:
1. It tries to generate separate JSON files for each source file (we have 260+ source files)
2. The bundled files are too large to parse efficiently
3. The standard `wp i18n make-json` command times out on large bundles

Instead, we:
1. Parse all JavaScript strings from the `.po` file
2. Generate one JSON file per bundled script with all translations
3. Manually inject translations inline using `wp_add_inline_script()`

### How translations are loaded

**For the block editor** (`index.min.js`) in `core/class-maxi-blocks.php` (lines 153-178):
```php
$locale = get_locale();
$json_file = plugin_dir_path(dirname(__FILE__)) . 'languages/maxi-blocks-' . $locale . '-' . md5('maxi-blocks/build/index.min.js') . '.json';

if (file_exists($json_file)) {
    $translations_json = file_get_contents($json_file);
    $translations_data = json_decode($translations_json, true);

    if ($translations_data && isset($translations_data['locale_data'])) {
        // Safely re-encode the JSON to prevent injection attacks
        $safe_json = wp_json_encode($translations_data, JSON_HEX_TAG | JSON_UNESCAPED_SLASHES);

        if ($safe_json !== false) {
            wp_add_inline_script(
                'maxi-blocks-block-editor',
                sprintf(
                    '( function( domain, translations ) {
                        var localeData = translations.locale_data[ domain ] || translations.locale_data.messages;
                        localeData[""].domain = domain;
                        wp.i18n.setLocaleData( localeData, domain );
                    } )( "maxi-blocks", %s );',
                    $safe_json
                ),
                'before'
            );
        }
    }
}
```

**For the dashboard** (`admin.min.js`) in `core/admin/class-maxi-dashboard.php` (lines 182-209):

(Same pattern as editor - loads translation JSON and injects via `wp_add_inline_script`)

**For the starter sites** (`main.js`) in `core/admin/class-maxi-dashboard.php` (after line 1833) and `core/admin/quick-start/class-maxi-quick-start.php` (after line 1213):
```php
$locale = get_locale();
$json_file = MAXI_PLUGIN_DIR_PATH . 'languages/maxi-blocks-' . $locale . '-' . md5('maxi-blocks/build/admin.min.js') . '.json';

if (file_exists($json_file)) {
    $translations_json = file_get_contents($json_file);
    $translations_data = json_decode($translations_json, true);

    if ($translations_data && isset($translations_data['locale_data'])) {
        // Safely re-encode the JSON to prevent injection attacks
        $safe_json = wp_json_encode($translations_data);

        if ($safe_json !== false) {
            // Build inline script by concatenation instead of sprintf to avoid corruption
            $inline_script = '( function( domain, translations ) {
                    var localeData = translations.locale_data[ domain ] || translations.locale_data.messages;
                    localeData[""].domain = domain;
                    wp.i18n.setLocaleData( localeData, domain );
                } )( "maxi-blocks", ' . $safe_json . ' );';

            wp_add_inline_script(
                'maxi-admin',
                $inline_script,
                'before'
            );
        }
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

The hash in each filename is calculated from the full relative path from `wp-content/plugins/`:

**Editor script:**
```php
md5('maxi-blocks/build/index.min.js')
// Result: 2f2df17011b16d4ca25e596e0409fe72
```

**Admin script:**
```php
md5('maxi-blocks/build/admin.min.js')
// Result: 45dd5f3bbfc23f9c617e432aa6578d60
```

**Starter Sites script:**
```php
md5('maxi-blocks/core/admin/starter-sites/build/js/main.js')
// Result: a547bf49c483076522aa4a89cde6391f
```

**Important:** Use the full path including `maxi-blocks/`, not just `build/index.min.js`.

## Troubleshooting

### Translations not showing in JavaScript

1. Check all three JSON files exist:
   ```bash
   ls languages/maxi-blocks-de_DE-*.json
   # Should show 3 files:
   # - maxi-blocks-de_DE-2f2df17011b16d4ca25e596e0409fe72.json (editor)
   # - maxi-blocks-de_DE-45dd5f3bbfc23f9c617e432aa6578d60.json (admin)
   # - maxi-blocks-de_DE-a547bf49c483076522aa4a89cde6391f.json (starter sites)
   ```

2. Verify the JSON is valid:
   ```bash
   cat languages/maxi-blocks-de_DE-2f2df17011b16d4ca25e596e0409fe72.json | python3 -m json.tool
   ```

3. Check the browser console for errors

4. View page source and search for `setLocaleData` - you should see your translations

5. Make sure you've cleared cache:
   ```bash
   wp cache flush
   ```

### Adding a new language

1. Create the language in Loco Translate
2. Translate strings
3. Run the generation script (no code changes needed - the script auto-detects all available locales):
   ```bash
   cd languages
   php generate-translations.php
   ```

## For Other Languages

The script automatically processes all available translation files by default:

```bash
# Process all available locales
cd languages
php generate-translations.php

# Process specific locale(s)
cd languages
php generate-translations.php de_DE
php generate-translations.php es_ES fr_FR it_IT
```

The script will auto-detect all `maxi-blocks-*.po` files when run without arguments.

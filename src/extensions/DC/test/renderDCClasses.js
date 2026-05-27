import fs from 'fs';
import os from 'os';
import path from 'path';
import { spawnSync } from 'child_process';

const repoRoot = path.resolve(__dirname, '../../../..');

const normalizePhpPath = filePath => filePath.replace(/\\/g, '/');

const phpCandidates = [
	process.env.PHP_BINARY,
	'C:/wamp/bin/php/php8.4.15/php.exe',
	'C:/wamp/bin/php/php8.3.28/php.exe',
	'C:/wamp/bin/php/php8.2.29/php.exe',
	'php',
].filter(Boolean);

const getPhpBinary = () =>
	phpCandidates.find(candidate => {
		const result = spawnSync(candidate, ['-v'], { encoding: 'utf8' });
		return result.status === 0;
	});

const phpBinary = getPhpBinary();
const maybeIt = phpBinary ? it : it.skip;

const makeFakeWordPressRoot = () => {
	const root = fs.mkdtempSync(path.join(os.tmpdir(), 'maxi-wp-'));
	const includesPath = path.join(root, 'wp-admin', 'includes');

	fs.mkdirSync(includesPath, { recursive: true });

	['file.php', 'media.php', 'image.php'].forEach(fileName => {
		fs.writeFileSync(path.join(includesPath, fileName), '<?php\n');
	});

	return root;
};

const runRenderClasses = content => {
	if (!phpBinary) {
		throw new Error('PHP binary was not found for dynamic content renderer test.');
	}

	const wpRoot = makeFakeWordPressRoot();
	const phpCode = `
if (!defined('ABSPATH')) define('ABSPATH', '${normalizePhpPath(wpRoot)}/');
if (!defined('MAXI_PLUGIN_DIR_PATH')) define('MAXI_PLUGIN_DIR_PATH', '${normalizePhpPath(repoRoot)}/');
if (!defined('DAY_IN_SECONDS')) define('DAY_IN_SECONDS', 86400);
if (!function_exists('__')) { function __($text, $domain = null) { return $text; } }
if (!function_exists('get_transient')) { function get_transient($key) { return 1; } }
if (!function_exists('set_transient')) { function set_transient($key, $value, $expiration = 0) { return true; } }
if (!function_exists('plugin_dir_path')) {
	function plugin_dir_path($file) {
		return rtrim(dirname($file), '/\\\\') . DIRECTORY_SEPARATOR;
	}
}
require_once MAXI_PLUGIN_DIR_PATH . 'core/class-maxi-dynamic-content.php';
$renderer = new MaxiBlocks_DynamicContent();
$attributes = [
	'uniqueID' => 'group-maxi-render-test-u',
	'dc-hide' => true,
];
$content = <<<'HTML'
${content}
HTML;
echo $renderer->render_dc_classes($attributes, $content);
`;

	const result = spawnSync(phpBinary, ['-d', 'display_errors=1', '-r', phpCode], {
		cwd: repoRoot,
		encoding: 'utf8',
		maxBuffer: 1024 * 1024 * 4,
	});

	fs.rmSync(wpRoot, { recursive: true, force: true });

	if (result.status !== 0) {
		throw new Error(result.stderr || result.stdout);
	}

	return result.stdout;
};

describe('MaxiBlocks_DynamicContent render_dc_classes', () => {
	maybeIt('hides a group when only no-content dynamic text and a Maxi SVG icon remain', () => {
		const result = runRenderClasses(`
<div class="wp-block-maxi-blocks-group-maxi maxi-block maxi-group-block" id="group-maxi-render-test-u">
	<div class="wp-block-maxi-blocks-svg-icon-maxi maxi-block maxi-svg-icon-block" id="svg-icon-maxi-render-test-u">
		<div class="maxi-svg-icon-block__icon">
			<svg viewBox="0 0 36 36"><path d="M1 1h10v10z"></path></svg>
		</div>
	</div>
	<div class="wp-block-maxi-blocks-text-maxi maxi-block maxi-text-block" id="text-maxi-render-test-u">
		<p class="maxi-text-block__content">No content found</p>
	</div>
</div>`);

		expect(result).toContain(
			'class="maxi-block--hidden wp-block-maxi-blocks-group-maxi maxi-block maxi-group-block"'
		);
		expect(result).toContain(
			'class="maxi-block--hidden wp-block-maxi-blocks-svg-icon-maxi maxi-block maxi-svg-icon-block"'
		);
	});

	maybeIt('keeps a group visible when it still has meaningful text content', () => {
		const result = runRenderClasses(`
<div class="wp-block-maxi-blocks-group-maxi maxi-block maxi-group-block" id="group-maxi-render-test-u">
	<div class="wp-block-maxi-blocks-svg-icon-maxi maxi-block maxi-svg-icon-block" id="svg-icon-maxi-render-test-u">
		<div class="maxi-svg-icon-block__icon">
			<svg viewBox="0 0 36 36"><path d="M1 1h10v10z"></path></svg>
		</div>
	</div>
	<div class="wp-block-maxi-blocks-text-maxi maxi-block maxi-text-block" id="text-maxi-render-test-u">
		<p class="maxi-text-block__content">Featured story</p>
	</div>
</div>`);

		expect(result).not.toContain('maxi-block--hidden');
	});
});

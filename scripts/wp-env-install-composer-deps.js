const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const projectRoot = path.resolve(__dirname, '..');
const autoloadPath = path.join(projectRoot, 'vendor', 'autoload.php');
const composerJsonPath = path.join(projectRoot, 'composer.json');

if (!fs.existsSync(composerJsonPath)) {
	process.exit(0);
}

if (fs.existsSync(autoloadPath)) {
	console.log('[maxi-mcp] Composer dependencies already installed.');
	process.exit(0);
}

const dockerMountPath = projectRoot.replace(/\\/g, '/');
const args = [
	'run',
	'--rm',
	'-v',
	`${dockerMountPath}:/app`,
	'-w',
	'/app',
	'composer:2',
	'composer',
	'install',
	'--no-interaction',
	'--prefer-dist',
	'--no-progress',
];

console.log('[maxi-mcp] Installing Composer dependencies in Docker...');

const result = spawnSync('docker', args, {
	cwd: projectRoot,
	stdio: 'inherit',
});

if (result.error || result.status !== 0) {
	console.warn(
		'[maxi-mcp] Composer install could not be completed automatically. Advanced MCP setup will stay unavailable until vendor dependencies are installed.'
	);
	process.exit(0);
}

console.log('[maxi-mcp] Composer dependencies installed.');

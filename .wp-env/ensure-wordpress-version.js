const { execFileSync } = require('child_process');
const path = require('path');

const expectedVersion = '6.4.3';
const wpEnv = path.resolve(__dirname, '../node_modules/.bin/wp-env');

for (const environment of ['cli', 'tests-cli']) {
	const run = (...args) =>
		execFileSync(wpEnv, ['run', environment, 'wp', ...args], {
			encoding: 'utf8',
			stdio: ['ignore', 'pipe', 'inherit'],
		}).trim();

	const installedVersion = run('core', 'version');

	if (installedVersion !== expectedVersion) {
		process.stdout.write(
			`Restoring WordPress ${expectedVersion} in ${environment} (found ${installedVersion}).\n`
		);
		run(
			'core',
			'download',
			'--',
			`--version=${expectedVersion}`,
			'--force',
			'--skip-content'
		);
	}

	const finalVersion = run('core', 'version');
	if (finalVersion !== expectedVersion) {
		throw new Error(
			`${environment} is running WordPress ${finalVersion}; expected ${expectedVersion}.`
		);
	}
}

const path = require('node:path');
const {
	runCopyPasteCoverageScan,
} = require('../src/extensions/copy-paste/scanCopyPasteCoverage');

const args = process.argv.slice(2);
let root = process.cwd();
let outputJson = false;

for (let i = 0; i < args.length; i += 1) {
	const arg = args[i];
	if (arg === '--json') {
		outputJson = true;
		continue;
	}
	if (!arg.startsWith('--')) {
		root = arg;
	}
}

const report = runCopyPasteCoverageScan(path.normalize(root));
if (outputJson) {
	console.log(JSON.stringify(report, null, 2));
	process.exitCode = report.some(item => item.missingStyleKeys.length > 0)
		? 1
		: 0;
} else {
	const missing = report.filter(item => item.missingStyleKeys.length > 0);
	const totalMissing = missing.reduce(
		(total, item) => total + item.missingStyleKeys.length,
		0
	);

	console.log(`Checked ${report.length} blocks`);
	if (missing.length === 0) {
		console.log('All blocks have copy/paste coverage for their mapped styles.');
		process.exit(0);
	}

	console.log(`${totalMissing} missing style keys across ${missing.length} blocks`);
	for (const block of missing) {
		console.log(`- ${block.block}: ${block.missingStyleKeys.length}`);
		for (const key of block.missingStyleKeys) {
			console.log(`  - ${key}`);
		}
	}
	process.exitCode = 1;
}

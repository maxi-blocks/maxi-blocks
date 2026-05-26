const path = require('node:path');
const {
	runCopyPasteAttributeCoverageScan,
} = require('../src/extensions/copy-paste/scanCopyPasteCoverage');

const args = process.argv.slice(2);
let root = process.cwd();
let outputJson = false;
let includeExcluded = false;
let fullOutput = false;
let flatOutput = false;
let limit = 25;
const ignoredCategories = new Set();

for (let index = 0; index < args.length; index += 1) {
	const arg = args[index];
	if (arg === '--json') {
		outputJson = true;
		continue;
	}
	if (arg === '--include-excluded') {
		includeExcluded = true;
		continue;
	}
	if (arg === '--full') {
		fullOutput = true;
		continue;
	}
	if (arg === '--flat') {
		flatOutput = true;
		continue;
	}
	if (arg === '--limit') {
		limit = Number.parseInt(args[index + 1], 10);
		index += 1;
		continue;
	}
	if (arg === '--ignore-category') {
		const categories = (args[index + 1] || '')
			.split(',')
			.map(category => category.trim())
			.filter(Boolean);
		categories.forEach(category => ignoredCategories.add(category));
		index += 1;
		continue;
	}
	if (!arg.startsWith('--')) {
		root = arg;
	}
}

if (!Number.isFinite(limit) || limit < 1) {
	limit = 25;
}

const printKeys = keys => {
	const keysToPrint = fullOutput ? keys : keys.slice(0, limit);
	for (const key of keysToPrint) {
		console.log(`  - ${key}`);
	}
	if (!fullOutput && keys.length > limit) {
		console.log(`  ... ${keys.length - limit} more; use --full or --json`);
	}
};

const applyIgnoredCategories = item => {
	if (ignoredCategories.size === 0) return item;

	const missingAttributeCategories = {};
	const ignoredAttributeKeys = [];
	for (const [category, keys] of Object.entries(
		item.missingAttributeCategories
	)) {
		if (ignoredCategories.has(category)) {
			ignoredAttributeKeys.push(...keys);
			continue;
		}
		missingAttributeCategories[category] = keys;
	}

	const missingAttributeKeys = Object.values(missingAttributeCategories)
		.flat()
		.sort((a, b) => a.localeCompare(b));

	return {
		...item,
		ignoredAttributeCount: ignoredAttributeKeys.length,
		ignoredAttributeKeys: ignoredAttributeKeys.sort((a, b) =>
			a.localeCompare(b)
		),
		missingAttributeCount: missingAttributeKeys.length,
		missingAttributeKeys,
		missingAttributeCategories,
		missingAttributeCategoryCounts: Object.fromEntries(
			Object.entries(missingAttributeCategories).map(([category, keys]) => [
				category,
				keys.length,
			])
		),
	};
};

const report = runCopyPasteAttributeCoverageScan(path.normalize(root)).map(
	applyIgnoredCategories
);

if (outputJson) {
	console.log(JSON.stringify(report, null, 2));
	process.exit(report.some(item => item.missingAttributeCount > 0) ? 1 : 0);
}

const missing = report.filter(item => item.missingAttributeCount > 0);
const totalMissing = missing.reduce(
	(total, item) => total + item.missingAttributeCount,
	0
);
const totalExcluded = report.reduce(
	(total, item) => total + item.excludedAttributeCount,
	0
);
const totalIgnored = report.reduce(
	(total, item) => total + (item.ignoredAttributeCount || 0),
	0
);

console.log(`Checked ${report.length} blocks`);
console.log(`${totalExcluded} intentionally excluded attribute keys`);
if (ignoredCategories.size > 0) {
	console.log(
		`${totalIgnored} ignored attribute keys by category: ${Array.from(
			ignoredCategories
		).join(', ')}`
	);
}

if (missing.length === 0) {
	console.log('All non-excluded block attributes have copy/paste coverage.');
} else {
	console.log(
		`${totalMissing} missing attribute keys across ${missing.length} blocks`
	);
	for (const block of missing) {
		console.log(`- ${block.block}: ${block.missingAttributeCount}`);
		if (flatOutput) {
			printKeys(block.missingAttributeKeys);
			continue;
		}
		for (const [category, keys] of Object.entries(
			block.missingAttributeCategories
		)) {
			console.log(`  ${category}: ${keys.length}`);
			const keysToPrint = fullOutput ? keys : keys.slice(0, limit);
			for (const key of keysToPrint) {
				console.log(`    - ${key}`);
			}
			if (!fullOutput && keys.length > limit) {
				console.log(
					`    ... ${keys.length - limit} more; use --full or --json`
				);
			}
		}
	}
}

if (includeExcluded) {
	const excluded = report.filter(item => item.excludedAttributeCount > 0);
	console.log('');
	console.log('Intentionally excluded attributes:');
	for (const block of excluded) {
		console.log(`- ${block.block}: ${block.excludedAttributeCount}`);
		printKeys(block.excludedAttributeKeys);
	}
}

process.exitCode = missing.length > 0 ? 1 : 0;

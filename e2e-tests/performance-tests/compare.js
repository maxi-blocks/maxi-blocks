/**
 * Performance Comparison Tool
 *
 * This script compares performance metrics between two JSON files containing test results.
 *
 * Usage:
 *   npm run compare-performance -- --file1 <file1> --file2 <file2> [--threshold <number>] [--showAllDetails <boolean>]
 *   node compare-performance.js --file1 <file1> --file2 <file2> [--threshold <number>] [--showAllDetails <boolean>]
 *
 * Options:
 *   --file1 <file1>             Path to the first JSON file (required)
 *   --file2 <file2>             Path to the second JSON file (required)
 *   --threshold <number>        Threshold in milliseconds for considering a change significant (default: 100)
 *   --showAllDetails <boolean>  Whether to show all details or only significant changes (default: false)
 *
 * Example:
 *   node compare-performance.js --file1 data1.json --file2 data2.json --threshold 50 --showAllDetails true
 *
 * Output:
 *   The script will print a comparison of performance metrics between the two files,
 *   highlighting significant changes based on the specified threshold.
 */

const fs = require('fs');
const path = require('path');

const DEFAULT_THRESHOLD = 100;
const DEFAULT_SHOW_ALL_DETAILS = false;

/**
 * Compares performance metrics between two JSON files.
 *
 * @param {string} file1 - Path to the first JSON file.
 * @param {string} file2 - Path to the second JSON file.
 * @param {number} threshold - The threshold (in milliseconds) for considering a change significant.
 * @param {boolean} showAllDetails - Whether to show all details or only significant changes.
 */
function comparePerformance(file1, file2, threshold, showAllDetails) {
	const data1 = JSON.parse(fs.readFileSync(file1, 'utf8'));
	const data2 = JSON.parse(fs.readFileSync(file2, 'utf8'));

	console.log(
		`Comparing ${path.basename(file1)} with ${path.basename(file2)}:\n`
	);

	for (const [block, metrics] of Object.entries(data1)) {
		if (!(block in data2)) {
			console.log(`⚠️  ${block} is not present in the second file.`);
			continue;
		}

		let blockPrinted = false;

		for (const [metric, values] of Object.entries(metrics)) {
			const oldMedian = calculateMedian(values.times);
			const newMedian = calculateMedian(data2[block][metric].times);
			const diff = newMedian - oldMedian;
			const percentChange = (diff / oldMedian) * 100;

			let status = 'unchanged';
			let statusEmoji = '➖';
			if (Math.abs(diff) > threshold) {
				if (diff > 0) {
					status = 'slower';
					statusEmoji = '🐢';
				} else {
					status = 'faster';
					statusEmoji = '🚀';
				}
			}

			if (showAllDetails || status !== 'unchanged') {
				if (!blockPrinted) {
					console.log(`${block}:`);
					blockPrinted = true;
				}

				console.log(`  ${metric}:`);
				console.log(`    Old median: ${oldMedian.toFixed(2)} ms`);
				console.log(
					`    New median: ${newMedian.toFixed(
						2
					)} ms`
				);
				console.log(
					`    Difference: ${diff.toFixed(
						2
					)} ms (${percentChange.toFixed(2)}%)`
				);
				console.log(`    Status: ${statusEmoji} ${status}`);

				if (showAllDetails) {
					console.log('    Detailed times:');
					console.log(
						`      Old: ${values.times
							.map(t => t.toFixed(2))
							.join(', ')}`
					);
					console.log(
						`      New: ${data2[block][metric].times
							.map(t => t.toFixed(2))
							.join(', ')}`
					);
				}

				console.log('');
			}
		}
	}
}

/**
 * Calculates the median of an array of numbers.
 * @param {number[]} numbers - The array of numbers.
 * @returns {number} The median value.
 */
function calculateMedian(numbers) {
  const sorted = numbers.slice().sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1] + sorted[middle]) / 2;
  }
  return sorted[middle];
}

/**
 * Parses command-line arguments.
 * @returns {{file1: string, file2: string, threshold: number, showAllDetails: boolean}}
 */
function parseArguments() {
	const args = process.argv.slice(2);
	const parsedArgs = {
		file1: null,
		file2: null,
		threshold: DEFAULT_THRESHOLD,
		showAllDetails: DEFAULT_SHOW_ALL_DETAILS,
	};

	for (let i = 0; i < args.length; i++) {
		switch (args[i]) {
			case '--file1':
				parsedArgs.file1 = args[++i];
				break;
			case '--file2':
				parsedArgs.file2 = args[++i];
				break;
			case '--threshold':
				parsedArgs.threshold = parseFloat(args[++i]);
				break;
			case '--showAllDetails':
				parsedArgs.showAllDetails = args[++i] === 'true';
				break;
		}
	}

	if (!parsedArgs.file1 || !parsedArgs.file2) {
		console.log(
			'Usage: node compare-performance.js --file1 <file1> --file2 <file2> [--threshold <number>] [--showAllDetails <boolean>]'
		);
		process.exit(1);
	}

	return parsedArgs;
}

// Parse command-line arguments and run the comparison
const { file1, file2, threshold, showAllDetails } = parseArguments();
comparePerformance(file1, file2, threshold, showAllDetails);

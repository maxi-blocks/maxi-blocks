/* eslint-disable no-console */

const ArgumentParser = require('./argument-parser');
const PerformanceComparator = require('./comparator');
const ResultWriter = require('./result-writer');

function main() {
	try {
		const args = ArgumentParser.parse();
		const comparator = new PerformanceComparator(
			args.file1,
			args.file2,
			args.threshold,
			args.percentThreshold,
			args.showAllDetails,
		);
		const results = comparator.compare();

		console.log(JSON.stringify(results, null, 2));

		const writer = new ResultWriter(
			results,
			args.threshold,
			args.percentThreshold,
			args.showAllDetails,
		);
		writer.saveResults();

		console.log(
			'Results saved to bin/performance_comparison.json and bin/performance_comparison.md',
		);
	} catch (error) {
		console.error(`Error: ${error.message}`);
		console.log(
			'Usage: node compare-performance.js --file1 <file1> --file2 <file2> [--threshold <number>] [--percentThreshold <number>] [--showAllDetails <boolean>]',
		);
		process.exit(1);
	}
}

main();

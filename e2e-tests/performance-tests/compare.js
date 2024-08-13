const fs = require('fs');
const path = require('path');

class PerformanceComparator {
	constructor(file1, file2, threshold, percentThreshold, showAllDetails) {
		this.file1 = file1;
		this.file2 = file2;
		this.threshold = threshold;
		this.percentThreshold = percentThreshold;
		this.showAllDetails = showAllDetails;
		this.results = {
			file1: path.basename(file1),
			file2: path.basename(file2),
			comparisons: [],
		};
	}

	compare() {
		const data1 = this.readJsonFile(this.file1);
		const data2 = this.readJsonFile(this.file2);

		this.results.comparisons = this.compareDataSets(data1, data2);
		return this.results;
	}

	compareDataSets(data1, data2) {
		const allBlocks = new Set([
			...Object.keys(data1),
			...Object.keys(data2),
		]);
		return Array.from(allBlocks)
			.map(block =>
				this.compareDataBlock(block, data1[block], data2[block])
			)
			.filter(
				comparison =>
					comparison.metrics.length > 0 || comparison.warning
			);
	}

	compareDataBlock(block, metrics1, metrics2) {
		if (!metrics1 && !metrics2) {
			return {
				block,
				warning: `${block} is not present in either file.`,
			};
		}
		if (!metrics1) {
			return {
				block,
				warning: `${block} is not present in the first file.`,
			};
		}
		if (!metrics2) {
			return {
				block,
				warning: `${block} is not present in the second file.`,
			};
		}

		return {
			block,
			metrics: this.compareMetrics(metrics1, metrics2),
		};
	}

	compareMetrics(metrics1, metrics2) {
		const allMetrics = new Set([
			...Object.keys(metrics1),
			...Object.keys(metrics2),
		]);
		return Array.from(allMetrics)
			.map(metric =>
				this.compareMetric(metric, metrics1[metric], metrics2[metric])
			)
			.filter(
				metricComparison =>
					this.showAllDetails ||
					metricComparison.status !== 'unchanged'
			);
	}

	compareMetric(metric, values1, values2) {
		if (!values1 || !values2) {
			return {
				metric,
				status: 'missing',
				statusEmoji: '❓',
				warning: `Metric ${metric} is missing in one of the files.`,
			};
		}

		const oldMedian = values1.median;
		const newMedian = values2.median;
		const diff = newMedian - oldMedian;
		const percentChange = oldMedian !== 0 ? (diff / oldMedian) * 100 : 0;
		const status = this.determineStatus(diff, percentChange);

		return {
			metric,
			oldMedian,
			newMedian,
			diff,
			percentChange,
			...status,
		};
	}

	determineStatus(diff, percentChange) {
		if (
			Math.abs(diff) <= this.threshold ||
			Math.abs(percentChange) <= this.percentThreshold
		) {
			return { status: 'unchanged', statusEmoji: '➖' };
		}
		return diff > 0
			? { status: 'slower', statusEmoji: '🐢' }
			: { status: 'faster', statusEmoji: '🚀' };
	}

	readJsonFile(filePath) {
		try {
			return JSON.parse(fs.readFileSync(filePath, 'utf8'));
		} catch (error) {
			throw new Error(
				`Error reading or parsing JSON file ${filePath}: ${error.message}`
			);
		}
	}
}

class ResultWriter {
	constructor(results, threshold, percentThreshold, outputDir = 'bin') {
		this.results = results;
		this.threshold = threshold;
		this.percentThreshold = percentThreshold;
		this.outputDir = outputDir;
		this.ensureOutputDirExists();
	}

	ensureOutputDirExists() {
		try {
			if (!fs.existsSync(this.outputDir)) {
				fs.mkdirSync(this.outputDir, { recursive: true });
			}
		} catch (error) {
			console.error(
				`Error creating output directory ${this.outputDir}: ${error.message}`
			);
		}
	}

	saveResults() {
		const baseName = 'performance_comparison';
		this.writeJsonFile(`${baseName}.json`);
		this.writeMarkdownFile(`${baseName}.md`);
	}

	writeJsonFile(fileName) {
		const filePath = path.join(this.outputDir, fileName);
		const jsonOutput = JSON.stringify(this.results, null, 2);
		try {
			fs.writeFileSync(filePath, jsonOutput);
		} catch (error) {
			console.error(
				`Error writing JSON file ${filePath}: ${error.message}`
			);
		}
	}

	writeMarkdownFile(fileName) {
		const filePath = path.join(this.outputDir, fileName);
		const markdownOutput = this.generateMarkdown();
		try {
			fs.writeFileSync(filePath, markdownOutput);
		} catch (error) {
			console.error(
				`Error writing markdown file ${filePath}: ${error.message}`
			);
		}
	}

	generateMarkdown() {
		let markdown = this.generateDescription();

		if (this.results.comparisons.length === 0) {
			markdown += `## No significant changes detected.\n\n`;
		} else {
			markdown += `| Block | Metric | Old Median (ms) | New Median (ms) | Difference (ms) | Change (%) | Status |\n`;
			markdown += `|-------|--------|-----------------|-----------------|-----------------|------------|--------|\n`;

			for (const comparison of this.results.comparisons) {
				if (comparison.warning) {
					markdown += `| ${comparison.block} | ⚠️ | | | | | ${comparison.warning} |\n`;
				} else {
					for (const metric of comparison.metrics) {
						markdown += `| ${comparison.block} | ${
							metric.metric
						} | ${metric.oldMedian.toFixed(
							2
						)} | ${metric.newMedian.toFixed(
							2
						)} | ${metric.diff.toFixed(
							2
						)} | ${metric.percentChange.toFixed(2)}% | ${
							metric.statusEmoji
						} ${metric.status} |\n`;
					}
				}
			}
		}

		return markdown;
	}

	generateDescription() {
		return `This report compares performance metrics between two test runs.

- **Old Run**: ${this.results.file1}
- **New Run**: ${this.results.file2}

## Notes:
- By default, only metrics that have changed beyond the threshold are shown.
- Threshold for considering a change significant: ${this.threshold}s and ${
			this.percentThreshold
		}%
- 🚀 indicates improved performance (faster)
- 🐢 indicates degraded performance (slower)
- ➖ indicates no significant change

${
	this.results.showAllDetails
		? 'All test results are shown, including unchanged metrics.\n\n'
		: 'Unchanged metrics are not displayed in this report.\n\n'
}
`;
	}
}

class ArgumentParser {
	static parse() {
		const args = process.argv.slice(2);
		const parsedArgs = {
			file1: null,
			file2: null,
			threshold: 0.2, // s
			percentThreshold: 3, // %
			showAllDetails: false,
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
					const thresholdValue = parseFloat(args[++i]);
					if (Number.isNaN(thresholdValue)) {
						throw new Error(
							'Invalid threshold value. Must be a number.'
						);
					}
					parsedArgs.threshold = thresholdValue;
					break;
				case '--percentThreshold':
					const percentThresholdValue = parseFloat(args[++i]);
					if (Number.isNaN(percentThresholdValue)) {
						throw new Error(
							'Invalid percentThreshold value. Must be a number.'
						);
					}
					parsedArgs.percentThreshold = percentThresholdValue;
					break;
				case '--showAllDetails':
					const showAllDetailsValue = args[++i].toLowerCase();
					if (
						showAllDetailsValue !== 'true' &&
						showAllDetailsValue !== 'false'
					) {
						throw new Error(
							'Invalid showAllDetails value. Must be true or false.'
						);
					}
					parsedArgs.showAllDetails = showAllDetailsValue === 'true';
					break;
				default:
					throw new Error(`Unknown argument: ${args[i]}`);
			}
		}

		if (!parsedArgs.file1 || !parsedArgs.file2) {
			throw new Error('Both --file1 and --file2 arguments are required.');
		}

		return parsedArgs;
	}
}

function main() {
	try {
		const args = ArgumentParser.parse();
		const comparator = new PerformanceComparator(
			args.file1,
			args.file2,
			args.threshold,
			args.percentThreshold,
			args.showAllDetails
		);
		const results = comparator.compare();

		console.log(JSON.stringify(results, null, 2));

		const writer = new ResultWriter(
			results,
			args.threshold,
			args.percentThreshold
		);
		writer.saveResults();

		console.log(
			`Results saved to bin/performance_comparison.json and bin/performance_comparison.md`
		);
	} catch (error) {
		console.error(`Error: ${error.message}`);
		console.log(
			'Usage: node compare-performance.js --file1 <file1> --file2 <file2> [--threshold <number>] [--percentThreshold <number>] [--showAllDetails <boolean>]'
		);
		process.exit(1);
	}
}

main();

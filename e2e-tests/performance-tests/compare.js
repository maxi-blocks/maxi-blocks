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

		const oldStats = this.calculateStatistics(values1.times);
		const newStats = this.calculateStatistics(values2.times);
		const diffMean = newStats.mean - oldStats.mean;
		const percentChangeMean =
			oldStats.mean !== 0 ? (diffMean / oldStats.mean) * 100 : 0;
		const status = this.determineStatus(oldStats, newStats);

		return {
			metric,
			oldStats,
			newStats,
			diffMean,
			percentChangeMean,
			...status,
			statusEmoji: status.statusEmoji,
		};
	}

	calculateStatistics(times) {
		const cleanedTimes = times.filter(time => time !== 0);
		return {
			mean: this.calculateMean(cleanedTimes),
			median: this.calculateMedian(cleanedTimes),
			min: this.calculateMin(cleanedTimes),
			max: this.calculateMax(cleanedTimes),
			standardDeviation: this.calculateStandardDeviation(cleanedTimes),
			sampleSize: cleanedTimes.length,
		};
	}

	calculateMean(data) {
		// Formula: mean = sum of all values / number of values
		return data.reduce((sum, value) => sum + value, 0) / data.length;
	}

	calculateMedian(data) {
		const sortedData = [...data].sort((a, b) => a - b);
		const mid = Math.floor(sortedData.length / 2);
		// Formula: If odd number of values, median is the middle value
		//          If even number of values, median is the average of the two middle values
		return sortedData.length % 2 === 0
			? (sortedData[mid - 1] + sortedData[mid]) / 2
			: sortedData[mid];
	}

	calculateMin(data) {
		// Minimum value in the dataset
		return Math.min(...data);
	}

	calculateMax(data) {
		// Maximum value in the dataset
		return Math.max(...data);
	}

	calculateStandardDeviation(data) {
		const mean = this.calculateMean(data);
		// Formula: sqrt(sum of squared differences from mean / (n - 1))
		return Math.sqrt(
			data.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) /
				(data.length - 1)
		);
	}

	determineStatus(oldStats, newStats) {
		const diffMean = newStats.mean - oldStats.mean;
		const percentChangeMean = this.calculatePercentChange(
			oldStats.mean,
			newStats.mean
		);
		const pooledSD = this.calculatePooledStandardDeviation(
			oldStats,
			newStats
		);
		const SE = this.calculateStandardError(
			pooledSD,
			oldStats.sampleSize,
			newStats.sampleSize
		);
		const tStatistic = this.calculateTStatistic(diffMean, SE);
		const degreesOfFreedom = oldStats.sampleSize + newStats.sampleSize - 2;
		const criticalTValue = this.getCriticalTValue(degreesOfFreedom);

		const isStatisticallySignificant =
			Math.abs(tStatistic) > criticalTValue;
		const isAboveThreshold = Math.abs(diffMean) > this.threshold;
		const isAbovePercentThreshold =
			Math.abs(percentChangeMean) > this.percentThreshold;

		if (isStatisticallySignificant && isAboveThreshold) {
			if (isAbovePercentThreshold) {
				return diffMean > 0
					? { status: 'significantly slower', statusEmoji: '🐢' }
					: { status: 'significantly faster', statusEmoji: '🚀' };
			} else {
				return diffMean > 0
					? { status: 'slightly slower', statusEmoji: '⚠️' }
					: { status: 'slightly faster', statusEmoji: '✅' };
			}
		} else {
			return { status: 'unchanged', statusEmoji: '➖' };
		}
	}

	calculatePercentChange(oldValue, newValue) {
		// Formula: (new value - old value) / old value * 100
		return oldValue !== 0 ? ((newValue - oldValue) / oldValue) * 100 : 0;
	}

	calculatePooledStandardDeviation(oldStats, newStats) {
		// Formula: sqrt(((n1 - 1) * s1^2 + (n2 - 1) * s2^2) / (n1 + n2 - 2))
		// Where n1, n2 are sample sizes and s1, s2 are standard deviations
		return Math.sqrt(
			((oldStats.sampleSize - 1) *
				Math.pow(oldStats.standardDeviation, 2) +
				(newStats.sampleSize - 1) *
					Math.pow(newStats.standardDeviation, 2)) /
				(oldStats.sampleSize + newStats.sampleSize - 2)
		);
	}

	calculateStandardError(pooledSD, sampleSize1, sampleSize2) {
		// Formula: pooled standard deviation * sqrt(1/n1 + 1/n2)
		// Where n1 and n2 are the sample sizes
		return pooledSD * Math.sqrt(1 / sampleSize1 + 1 / sampleSize2);
	}

	calculateTStatistic(diffMean, standardError) {
		// Formula: |difference in means| / standard error
		return Math.abs(diffMean) / standardError;
	}

	getCriticalTValue(degreesOfFreedom) {
		const tTable = {
			1: 12.706,
			2: 4.303,
			3: 3.182,
			4: 2.776,
			5: 2.571,
			6: 2.447,
			7: 2.365,
			8: 2.306,
			9: 2.262,
			10: 2.228,
			11: 2.201,
			12: 2.179,
			13: 2.16,
			14: 2.145,
			15: 2.131,
			16: 2.12,
			17: 2.11,
			18: 2.101,
			19: 2.093,
			20: 2.086,
			21: 2.08,
			22: 2.074,
			23: 2.069,
			24: 2.064,
			25: 2.06,
			26: 2.056,
			27: 2.052,
			28: 2.048,
			29: 2.045,
			30: 2.042,
			40: 2.021,
			50: 2.009,
			60: 2.0,
			80: 1.99,
			100: 1.984,
			120: 1.98,
			Infinity: 1.96,
		};

		const keys = Object.keys(tTable)
			.map(Number)
			.sort((a, b) => a - b);

		if (Object.hasOwn(tTable, degreesOfFreedom)) {
			return tTable[degreesOfFreedom];
		}

		let lowerDegreesOfFreedom = keys.find(df => df > degreesOfFreedom) - 1;
		let upperDegreesOfFreedom = lowerDegreesOfFreedom + 1;

		if (lowerDegreesOfFreedom === undefined) {
			return tTable[Infinity];
		}

		const lowerValue = tTable[lowerDegreesOfFreedom];
		const upperValue = tTable[upperDegreesOfFreedom];
		const proportion =
			(degreesOfFreedom - lowerDegreesOfFreedom) /
			(upperDegreesOfFreedom - lowerDegreesOfFreedom);

		return lowerValue + (upperValue - lowerValue) * proportion;
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
	constructor(
		results,
		threshold,
		percentThreshold,
		showAllDetails,
		outputDir = 'bin'
	) {
		this.results = results;
		this.threshold = threshold;
		this.percentThreshold = percentThreshold;
		this.showAllDetails = showAllDetails;
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
			markdown += `| Block | Metric | Old Mean (s) | New Mean (s) | Difference (s) | Change (%) | Status |\n`;
			markdown += `|-------|--------|---------------|---------------|-----------------|------------|--------|\n`;

			for (const comparison of this.results.comparisons) {
				if (comparison.warning) {
					markdown += `| ${comparison.block} | ⚠️ | | | | | ${comparison.warning} |\n`;
				} else if (comparison.metrics) {
					for (const metric of comparison.metrics) {
						const oldMean = metric.oldStats?.mean ?? 'N/A';
						const newMean = metric.newStats?.mean ?? 'N/A';
						const diffMean =
							oldMean !== 'N/A' && newMean !== 'N/A'
								? (newMean - oldMean).toFixed(2)
								: 'N/A';
						const percentChange =
							oldMean !== 'N/A' &&
							newMean !== 'N/A' &&
							oldMean !== 0
								? (
										((newMean - oldMean) / oldMean) *
										100
								  ).toFixed(2) + '%'
								: 'N/A';

						markdown += `| ${comparison.block} | ${
							metric.metric
						} | ${
							oldMean !== 'N/A' ? oldMean.toFixed(2) : 'N/A'
						} | ${
							newMean !== 'N/A' ? newMean.toFixed(2) : 'N/A'
						} | ${diffMean} | ${percentChange} | ${
							metric.statusEmoji
						} ${metric.status} |\n`;
					}
				}
			}
		}

		markdown += this.generateDetailedStatistics();

		return markdown;
	}

	generateDetailedStatistics() {
		let markdown = '';

		for (const comparison of this.results.comparisons) {
			markdown += `<details>\n<summary><strong>${comparison.block}</strong></summary>\n\n`;

			if (comparison.warning) {
				markdown += `⚠️ ${comparison.warning}\n\n`;
			} else if (comparison.metrics && comparison.metrics.length > 0) {
				for (const metric of comparison.metrics) {
					markdown += `### ${metric.metric}\n\n`;
					if (metric.status === 'missing') {
						markdown += `⚠️ ${metric.warning}\n\n`;
					} else if (metric.oldStats && metric.newStats) {
						markdown += `| Statistic | Old Value | New Value |\n`;
						markdown += `|-----------|-----------|-----------|\n`;
						markdown += this.generateStatRow(
							'Mean',
							metric.oldStats.mean,
							metric.newStats.mean
						);
						markdown += this.generateStatRow(
							'Median',
							metric.oldStats.median,
							metric.newStats.median
						);
						markdown += this.generateStatRow(
							'Min',
							metric.oldStats.min,
							metric.newStats.min
						);
						markdown += this.generateStatRow(
							'Max',
							metric.oldStats.max,
							metric.newStats.max
						);
						markdown += this.generateStatRow(
							'Standard Deviation',
							metric.oldStats.standardDeviation,
							metric.newStats.standardDeviation
						);
						markdown += this.generateStatRow(
							'Sample Size',
							metric.oldStats.sampleSize,
							metric.newStats.sampleSize
						);
						markdown += '\n';
					} else {
						markdown += `⚠️ Incomplete data for this metric\n\n`;
					}
				}
			} else {
				markdown += `No metrics data available for this block.\n\n`;
			}

			markdown += `</details>\n\n`;
		}

		if (markdown.length === 0) {
			return '';
		}

		return `\n## Detailed Statistics\n\n${markdown}`;
	}

	generateStatRow(statName, oldValue, newValue) {
		const formatValue = value =>
			value !== undefined ? value.toFixed(2) : 'N/A';
		return `| ${statName} | ${formatValue(oldValue)} | ${formatValue(
			newValue
		)} |\n`;
	}

	generateDescription() {
		return `This report compares performance metrics between two test runs.

- **Old Run**: ${this.results.file1}
- **New Run**: ${this.results.file2}

## Notes:
- Changes are considered significant if they meet these criteria:
  1. Statistically significant (using t-test)
  2. Absolute difference > ${this.threshold}s
  3. Percentage change > ${this.percentThreshold}%

${
	this.showAllDetails
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
			threshold: 0.1, // s
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
			args.percentThreshold,
			args.showAllDetails
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

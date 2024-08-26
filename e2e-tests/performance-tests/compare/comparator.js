const fs = require('fs');
const path = require('path');

class PerformanceComparator {
	constructor(file1, file2, threshold, percentThreshold) {
		this.file1 = file1;
		this.file2 = file2;
		this.threshold = threshold;
		this.percentThreshold = percentThreshold;
	}

	compare() {
		const data1 = this.readJsonFile(this.file1);
		const data2 = this.readJsonFile(this.file2);

		const results = {
			file1: path.basename(this.file1),
			file2: path.basename(this.file2),
			comparisons: this.compareDataSets(data1, data2),
		};

		return results;
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
					comparison.metrics?.length > 0 || comparison.warning
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
		return Array.from(allMetrics).map(metric =>
			this.compareMetric(metric, metrics1[metric], metrics2[metric])
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
		const percentChangeMean = PerformanceComparator.calculatePercentChange(
			oldStats.mean,
			newStats.mean
		);
		const status = this.determineStatus(diffMean, percentChangeMean);

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
			mean: PerformanceComparator.calculateMean(cleanedTimes),
			median: PerformanceComparator.calculateMedian(cleanedTimes),
			min: PerformanceComparator.calculateMin(cleanedTimes),
			max: PerformanceComparator.calculateMax(cleanedTimes),
			standardDeviation:
				PerformanceComparator.calculateStandardDeviation(cleanedTimes),
			sampleSize: cleanedTimes.length,
		};
	}

	static calculateMean(data) {
		return data.reduce((sum, value) => sum + value, 0) / data.length;
	}

	static calculateMedian(data) {
		const sortedData = [...data].sort((a, b) => a - b);
		const mid = Math.floor(sortedData.length / 2);
		return sortedData.length % 2 === 0
			? (sortedData[mid - 1] + sortedData[mid]) / 2
			: sortedData[mid];
	}

	static calculateMin(data) {
		return Math.min(...data);
	}

	static calculateMax(data) {
		return Math.max(...data);
	}

	static calculateStandardDeviation(data) {
		const mean = PerformanceComparator.calculateMean(data);
		return Math.sqrt(
			data.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) /
				(data.length - 1)
		);
	}

	static calculatePercentChange(oldValue, newValue) {
		return oldValue !== 0 ? ((newValue - oldValue) / oldValue) * 100 : 0;
	}

	determineStatus(diffMean, percentChangeMean) {
		const isAboveThreshold = Math.abs(diffMean) > this.threshold;
		const isAbovePercentThreshold =
			Math.abs(percentChangeMean) > this.percentThreshold;

		if (isAboveThreshold) {
			if (!isAbovePercentThreshold) {
				return diffMean > 0
					? { status: 'Regressed', statusEmoji: '🐢' }
					: { status: 'Improved', statusEmoji: '🚀' };
			} else {
				return { status: 'Unchanged', statusEmoji: '➖' };
			}
		} else {
			return { status: 'Below threshold', statusEmoji: '➖' };
		}
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

module.exports = PerformanceComparator;

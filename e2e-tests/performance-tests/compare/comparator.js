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
		// Formula: mean = sum of all values / number of values
		return data.reduce((sum, value) => sum + value, 0) / data.length;
	}

	static calculateMedian(data) {
		const sortedData = [...data].sort((a, b) => a - b);
		const mid = Math.floor(sortedData.length / 2);
		// Formula: If odd number of values, median is the middle value
		//          If even number of values, median is the average of the two middle values
		return sortedData.length % 2 === 0
			? (sortedData[mid - 1] + sortedData[mid]) / 2
			: sortedData[mid];
	}

	static calculateMin(data) {
		// Minimum value in the dataset
		return Math.min(...data);
	}

	static calculateMax(data) {
		// Maximum value in the dataset
		return Math.max(...data);
	}

	static calculateStandardDeviation(data) {
		const mean = PerformanceComparator.calculateMean(data);
		// Formula: sqrt(sum of squared differences from mean / (n - 1))
		return Math.sqrt(
			data.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) /
				(data.length - 1)
		);
	}

	determineStatus(oldStats, newStats) {
		const diffMean = newStats.mean - oldStats.mean;
		const percentChangeMean = PerformanceComparator.calculatePercentChange(
			oldStats.mean,
			newStats.mean
		);
		const pooledSD = PerformanceComparator.calculatePooledStandardDeviation(
			oldStats,
			newStats
		);
		const SE = PerformanceComparator.calculateStandardError(
			pooledSD,
			oldStats.sampleSize,
			newStats.sampleSize
		);
		const tStatistic = PerformanceComparator.calculateTStatistic(
			diffMean,
			SE
		);
		const degreesOfFreedom = oldStats.sampleSize + newStats.sampleSize - 2;
		const criticalTValue =
			PerformanceComparator.getCriticalTValue(degreesOfFreedom);

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

	static calculatePercentChange(oldValue, newValue) {
		// Formula: (new value - old value) / old value * 100
		return oldValue !== 0 ? ((newValue - oldValue) / oldValue) * 100 : 0;
	}

	static calculatePooledStandardDeviation(oldStats, newStats) {
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

	static calculateStandardError(pooledSD, sampleSize1, sampleSize2) {
		// Formula: pooled standard deviation * sqrt(1/n1 + 1/n2)
		// Where n1 and n2 are the sample sizes
		return pooledSD * Math.sqrt(1 / sampleSize1 + 1 / sampleSize2);
	}

	static calculateTStatistic(diffMean, standardError) {
		// Formula: |difference in means| / standard error
		return Math.abs(diffMean) / standardError;
	}

	static getCriticalTValue(degreesOfFreedom) {
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

module.exports = PerformanceComparator;

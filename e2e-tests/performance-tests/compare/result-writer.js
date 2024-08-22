const fs = require('fs');
const path = require('path');

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
			markdown += '## No significant changes detected.\n\n';
		} else {
			markdown += '\n## Summary\n\n';
			markdown += '\n';
			markdown +=
				'| Block | Metric | Old Mean (s) | New Mean (s) | Difference (s) | Change (%) | Status |\n';
			markdown +=
				'|-------|--------|---------------|---------------|-----------------|------------|--------|\n';

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
								? `${(
										((newMean - oldMean) / oldMean) *
										100
								  ).toFixed(2)}%`
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
						markdown += '| Statistic | Old Value | New Value |\n';
						markdown += '|-----------|-----------|-----------|\n';
						markdown += ResultWriter.generateStatRow(
							'Mean',
							metric.oldStats.mean,
							metric.newStats.mean
						);
						markdown += ResultWriter.generateStatRow(
							'Median',
							metric.oldStats.median,
							metric.newStats.median
						);
						markdown += ResultWriter.generateStatRow(
							'Min',
							metric.oldStats.min,
							metric.newStats.min
						);
						markdown += ResultWriter.generateStatRow(
							'Max',
							metric.oldStats.max,
							metric.newStats.max
						);
						markdown += ResultWriter.generateStatRow(
							'Standard Deviation',
							metric.oldStats.standardDeviation,
							metric.newStats.standardDeviation
						);
						markdown += ResultWriter.generateStatRow(
							'Sample Size',
							metric.oldStats.sampleSize,
							metric.newStats.sampleSize
						);
						markdown += '\n';
					} else {
						markdown += '⚠️ Incomplete data for this metric\n\n';
					}
				}
			} else {
				markdown += 'No metrics data available for this block.\n\n';
			}

			markdown += '</details>\n\n';
		}

		if (markdown.length === 0) {
			return '';
		}

		return `\n## Detailed Statistics\n\n${markdown}`;
	}

	static generateStatRow(statName, oldValue, newValue) {
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
  1. Absolute difference > ${this.threshold}s
  2. Percentage change > ${this.percentThreshold}%
`;
	}
}

module.exports = ResultWriter;

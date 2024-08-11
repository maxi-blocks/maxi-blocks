const fs = require('fs');
const path = require('path');

class PerformanceComparator {
    constructor(file1, file2, threshold, showAllDetails) {
        this.file1 = file1;
        this.file2 = file2;
        this.threshold = threshold;
        this.showAllDetails = showAllDetails;
        this.results = {
            file1: path.basename(file1),
            file2: path.basename(file2),
            comparisons: []
        };
    }

    compare() {
        const data1 = this.readJsonFile(this.file1);
        const data2 = this.readJsonFile(this.file2);

        for (const [block, metrics] of Object.entries(data1)) {
            if (!(block in data2)) {
                this.results.comparisons.push({
                    block,
                    warning: `${block} is not present in the second file.`
                });
                continue;
            }

            const blockComparison = this.compareBlock(block, metrics, data2[block]);
            if (blockComparison.metrics.length > 0) {
                this.results.comparisons.push(blockComparison);
            }
        }

        return this.results;
    }

    compareBlock(block, metrics1, metrics2) {
        const blockComparison = { block, metrics: [] };

        for (const [metric, values] of Object.entries(metrics1)) {
            const oldMedian = this.calculateMedian(values.times);
            const newMedian = this.calculateMedian(metrics2[metric].times);
            const diff = newMedian - oldMedian;
            const percentChange = (diff / oldMedian) * 100;

            const status = this.determineStatus(diff);

            if (this.showAllDetails || status.status !== 'unchanged') {
                blockComparison.metrics.push({
                    metric,
                    oldMedian,
                    newMedian,
                    diff,
                    percentChange,
                    ...status,
                    oldTimes: values.times,
                    newTimes: metrics2[metric].times
                });
            }
        }

        return blockComparison;
    }

    determineStatus(diff) {
        if (Math.abs(diff) <= this.threshold) {
            return { status: 'unchanged', statusEmoji: '➖' };
        }
        return diff > 0
            ? { status: 'slower', statusEmoji: '🐢' }
            : { status: 'faster', statusEmoji: '🚀' };
    }

    calculateMedian(numbers) {
        const sorted = numbers.slice().sort((a, b) => a - b);
        const middle = Math.floor(sorted.length / 2);
        return sorted.length % 2 === 0
            ? (sorted[middle - 1] + sorted[middle]) / 2
            : sorted[middle];
    }

    readJsonFile(filePath) {
        try {
            return JSON.parse(fs.readFileSync(filePath, 'utf8'));
        } catch (error) {
            throw new Error(`Error reading or parsing JSON file ${filePath}: ${error.message}`);
        }
    }
}

class ResultWriter {
    constructor(results, outputDir = 'bin') {
        this.results = results;
        this.outputDir = outputDir;
        this.ensureOutputDirExists();
    }

    ensureOutputDirExists() {
        if (!fs.existsSync(this.outputDir)) {
            fs.mkdirSync(this.outputDir, { recursive: true });
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
        fs.writeFileSync(filePath, jsonOutput);
    }

    writeMarkdownFile(fileName) {
        const filePath = path.join(this.outputDir, fileName);
        const markdownOutput = this.generateMarkdown();
        fs.writeFileSync(filePath, markdownOutput);
    }

    generateMarkdown() {
        let markdown = `# Performance Comparison: ${this.results.file1} vs ${this.results.file2}\n\n`;

        for (const comparison of this.results.comparisons) {
            if (comparison.warning) {
                markdown += `## ⚠️ ${comparison.block}\n\n${comparison.warning}\n\n`;
            } else {
                markdown += `## ${comparison.block}\n\n`;
                markdown += `| Metric | Old Median (ms) | New Median (ms) | Difference (ms) | Change (%) | Status |\n`;
                markdown += `|--------|-----------------|-----------------|-----------------|------------|--------|\n`;
                for (const metric of comparison.metrics) {
                    markdown += `| ${metric.metric} | ${metric.oldMedian.toFixed(2)} | ${metric.newMedian.toFixed(2)} | ${metric.diff.toFixed(2)} | ${metric.percentChange.toFixed(2)}% | ${metric.statusEmoji} ${metric.status} |\n`;
                }
                markdown += '\n';
            }
        }

        return markdown;
    }
}

class ArgumentParser {
    static parse() {
        const args = process.argv.slice(2);
        const parsedArgs = {
            file1: null,
            file2: null,
            threshold: 100,
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
                    if (isNaN(thresholdValue)) {
                        throw new Error('Invalid threshold value. Must be a number.');
                    }
                    parsedArgs.threshold = thresholdValue;
                    break;
                case '--showAllDetails':
                    const showAllDetailsValue = args[++i].toLowerCase();
                    if (showAllDetailsValue !== 'true' && showAllDetailsValue !== 'false') {
                        throw new Error('Invalid showAllDetails value. Must be true or false.');
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
        const comparator = new PerformanceComparator(args.file1, args.file2, args.threshold, args.showAllDetails);
        const results = comparator.compare();

        console.log(JSON.stringify(results, null, 2));

        const writer = new ResultWriter(results);
        writer.saveResults();

        console.log(`Results saved to bin/performance_comparison.json and bin/performance_comparison.md`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        console.log('Usage: node compare-performance.js --file1 <file1> --file2 <file2> [--threshold <number>] [--showAllDetails <boolean>]');
        process.exit(1);
    }
}

main();

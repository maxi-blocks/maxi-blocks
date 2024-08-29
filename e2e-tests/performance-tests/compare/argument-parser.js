class ArgumentParser {
	static parse() {
		const args = process.argv.slice(2);
		const parsedArgs = {
			file1: null,
			file2: null,
			threshold: 0.1, // s
			percentThreshold: 3, // %
		};

		for (let i = 0; i < args.length; i += 1) {
			switch (args[i]) {
				case '--file1':
					i += 1;
					parsedArgs.file1 = args[i];
					break;
				case '--file2':
					i += 1;
					parsedArgs.file2 = args[i];
					break;
				case '--threshold':
					i += 1;
					// eslint-disable-next-line no-case-declarations
					const thresholdValue = parseFloat(args[i]);
					if (Number.isNaN(thresholdValue)) {
						throw new Error(
							'Invalid threshold value. Must be a number.'
						);
					}
					parsedArgs.threshold = thresholdValue;
					break;
				case '--percentThreshold':
					i += 1;
					// eslint-disable-next-line no-case-declarations
					const percentThresholdValue = parseFloat(args[i]);
					if (Number.isNaN(percentThresholdValue)) {
						throw new Error(
							'Invalid percentThreshold value. Must be a number.'
						);
					}
					parsedArgs.percentThreshold = percentThresholdValue;
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

module.exports = ArgumentParser;

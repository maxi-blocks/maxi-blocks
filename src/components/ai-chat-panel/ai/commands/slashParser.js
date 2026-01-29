const tokenize = input => {
	const tokens = [];
	let current = '';
	let inQuotes = false;

	for (let i = 0; i < input.length; i += 1) {
		const char = input[i];

		if (char === '"') {
			inQuotes = !inQuotes;
			continue;
		}

		if (!inQuotes && /\s/.test(char)) {
			if (current) {
				tokens.push(current);
				current = '';
			}
			continue;
		}

		current += char;
	}

	if (current) {
		tokens.push(current);
	}

	return tokens;
};

export const parseSlashCommand = input => {
	if (typeof input !== 'string') return null;
	const trimmed = input.trim();
	if (!trimmed.startsWith('/')) return null;

	const tokens = tokenize(trimmed);
	if (!tokens.length) return null;

	const command = tokens[0].slice(1).toLowerCase();
	const args = tokens.slice(1);

	switch (command) {
		case 'set':
			return {
				kind: 'slash',
				command,
				raw: trimmed,
				path: args[0] || '',
				value: args.slice(1).join(' ') || '',
				args,
			};
		case 'toggle':
		case 'reset':
			return {
				kind: 'slash',
				command,
				raw: trimmed,
				path: args[0] || '',
				args,
			};
		case 'increment':
			return {
				kind: 'slash',
				command,
				raw: trimmed,
				path: args[0] || '',
				amount: args[1] || '1',
				args,
			};
		case 'color':
		case 'icon':
		case 'help':
			return {
				kind: 'slash',
				command,
				raw: trimmed,
				query: args.join(' '),
				args,
			};
		default:
			return {
				kind: 'slash',
				command,
				raw: trimmed,
				args,
			};
	}
};

export default parseSlashCommand;

import { parseSlashCommand } from '../ai/commands/slashParser';

describe('slash parser', () => {
	test('parses set command', () => {
		const result = parseSlashCommand('/set radius 12');
		expect(result.command).toBe('set');
		expect(result.path).toBe('radius');
		expect(result.value).toBe('12');
	});

	test('parses toggle command', () => {
		const result = parseSlashCommand('/toggle shadow');
		expect(result.command).toBe('toggle');
		expect(result.path).toBe('shadow');
	});

	test('parses color command', () => {
		const result = parseSlashCommand('/color primary-500');
		expect(result.command).toBe('color');
		expect(result.query).toBe('primary-500');
	});
});

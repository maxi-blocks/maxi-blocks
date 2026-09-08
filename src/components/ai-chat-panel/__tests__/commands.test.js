import { buildPatch, createSetOp, createToggleOp } from '../ai/commands/patchBuilder';
import { parseSlashCommand } from '../ai/commands/slashParser';
import { ATTRIBUTE_TYPES } from '../ai/attributes/attributeTypes';
import { validateOp } from '../ai/commands/patchValidators';
import { normalizeAttributes } from '../ai/attributes/normalizeAttributes';
import { createAttributeRegistry } from '../ai/attributes/attributeRegistry';
import { routeCommand } from '../ai/commands/commandRouter';

const sampleData = {
	blocks: {
		'button-maxi': ['background-color', 'icon-name', 'font-size'],
	},
};

const buildRegistry = () => createAttributeRegistry(normalizeAttributes(sampleData));

describe('patch builder', () => {
	test('builds a patch array from a single op', () => {
		const op = createSetOp('background-color', 'primary');
		const patch = buildPatch(op);
		expect(patch).toHaveLength(1);
		expect(patch[0].op).toBe('set');
	});

	test('builds a patch array from multiple ops', () => {
		const patch = buildPatch([createToggleOp('is-enabled')]);
		expect(patch).toHaveLength(1);
		expect(patch[0].op).toBe('toggle');
	});
});

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

describe('patch validation', () => {
	test('validates boolean toggle', () => {
		const entry = { path: 'is-enabled', type: ATTRIBUTE_TYPES.BOOLEAN };
		const op = createToggleOp('is-enabled');
		const result = validateOp(op, entry);
		expect(result.ok).toBe(true);
	});

	test('rejects invalid boolean set', () => {
		const entry = { path: 'is-enabled', type: ATTRIBUTE_TYPES.BOOLEAN };
		const op = createSetOp('is-enabled', 'maybe');
		const result = validateOp(op, entry);
		expect(result.ok).toBe(false);
	});

	test('normalizes color values', () => {
		const entry = { path: 'background-color', type: ATTRIBUTE_TYPES.COLOR };
		const op = createSetOp('background-color', '#ffffff');
		const result = validateOp(op, entry);
		expect(result.ok).toBe(true);
		expect(result.value).toContain('maxi');
	});
});

describe('command router', () => {
	test('/color routes to color update', () => {
		const registry = buildRegistry();
		const result = routeCommand('/color primary', {
			registry,
			block: 'button-maxi',
		});

		expect(result.ok).toBe(true);
		expect(result.patch).toHaveLength(1);
		expect(String(result.patch[0].value)).toContain('maxi');
	});

	test('/icon routes to icon update', () => {
		const registry = buildRegistry();
		const result = routeCommand('/icon arrow-right', {
			registry,
			block: 'button-maxi',
		});

		expect(result.ok).toBe(true);
		expect(result.patch[0].path).toContain('icon');
	});

	test('natural language sets attributes', () => {
		const registry = buildRegistry();
		const result = routeCommand('set background color to primary', {
			registry,
			block: 'button-maxi',
		});

		expect(result.ok).toBe(true);
		expect(result.patch[0].path).toContain('background-color');
	});
});

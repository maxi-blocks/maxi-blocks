import { ATTRIBUTE_TYPES } from '../ai/attributes/attributeTypes';
import { validateOp } from '../ai/commands/patchValidators';
import { createSetOp, createToggleOp } from '../ai/commands/patchBuilder';

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

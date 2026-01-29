import { buildPatch, createSetOp, createToggleOp } from '../ai/commands/patchBuilder';

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

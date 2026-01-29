import { normalizeAttributes } from '../ai/attributes/normalizeAttributes';
import { createAttributeRegistry } from '../ai/attributes/attributeRegistry';
import { routeCommand } from '../ai/commands/commandRouter';

const sampleData = {
	blocks: {
		'button-maxi': ['background-color', 'icon-name', 'font-size'],
	},
};

const buildRegistry = () => createAttributeRegistry(normalizeAttributes(sampleData));

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

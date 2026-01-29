import { normalizeAttributes } from '../ai/attributes/normalizeAttributes';
import { createAttributeRegistry } from '../ai/attributes/attributeRegistry';

const sampleData = {
	blocks: {
		'test-block': ['background-color', 'font-size', 'is-enabled'],
	},
};

describe('attribute registry', () => {
	test('builds registry for a block', () => {
		const normalized = normalizeAttributes(sampleData);
		const registry = createAttributeRegistry(normalized);
		const attrs = registry.getAttributesForBlock('test-block');
		expect(attrs).toHaveLength(3);
	});

	test('finds attributes by keyword', () => {
		const registry = createAttributeRegistry(normalizeAttributes(sampleData));
		const matches = registry.findAttribute('background', { block: 'test-block' });
		expect(matches.length).toBeGreaterThan(0);
		expect(matches[0].path).toContain('background');
	});
});

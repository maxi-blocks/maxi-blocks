import { normalizeAttributes } from '../ai/attributes/normalizeAttributes';
import { createAttributeRegistry } from '../ai/attributes/attributeRegistry';
import { buildSuggestions } from '../ai/suggestions/buildSuggestions';

const sampleData = {
	blocks: {
		'test-block': ['background-color', 'font-size'],
	},
};

describe('suggestions builder', () => {
	test('returns attribute suggestions', async () => {
		const registry = createAttributeRegistry(normalizeAttributes(sampleData));
		const suggestions = await buildSuggestions('background', registry, {
			block: 'test-block',
			includeTypesense: false,
		});
		const hasAttribute = suggestions.some(
			suggestion => suggestion.type === 'attribute'
		);
		expect(hasAttribute).toBe(true);
	});
});

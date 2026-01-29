import rawAttributes from '../ai/attributes/maxi-block-attributes.json';
import { getAllowedAttributes, getBlockAttributeSpec } from '../ai/attributes/attributes.catalog';

describe('attributes catalog', () => {
	test('loads allowed attributes for a block', () => {
		const [blockName] = Object.keys(rawAttributes.blocks);
		const allowed = getAllowedAttributes(blockName);
		expect(allowed.length).toBeGreaterThan(0);
	});

	test('returns attribute spec', () => {
		const [blockName] = Object.keys(rawAttributes.blocks);
		const [attrName] = rawAttributes.blocks[blockName];
		const spec = getBlockAttributeSpec(blockName, attrName);
		expect(spec).toBeTruthy();
		expect(spec.name).toBeDefined();
	});
});

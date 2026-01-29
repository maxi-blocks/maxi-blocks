import rawAttributes from '../ai/attributes/maxi-block-attributes.json';
import { validateAttributesForBlock } from '../ai/attributes/attributes.validate';

const findAttribute = tokens => {
	const tokenList = Array.isArray(tokens) ? tokens : [tokens];
	for (const [blockName, attrs] of Object.entries(rawAttributes.blocks)) {
		const found = attrs.find(attr =>
			tokenList.some(token => attr.toLowerCase().includes(token))
		);
		if (found) return { blockName, attrName: found };
	}
	return null;
};

describe('attributes.validate', () => {
	test('rejects unknown attributes', () => {
		const [blockName] = Object.keys(rawAttributes.blocks);
		const result = validateAttributesForBlock(blockName, { 'not-real': 1 });
		expect(result.ok).toBe(false);
	});

	test('rejects wrong type for numbers', () => {
		const target = findAttribute(['opacity', 'width', 'height', 'size', 'radius']);
		expect(target).toBeTruthy();
		const result = validateAttributesForBlock(target.blockName, {
			[target.attrName]: 'not-a-number',
		});
		expect(result.ok).toBe(false);
	});

	test('accepts color values', () => {
		const target = findAttribute('color');
		expect(target).toBeTruthy();
		const result = validateAttributesForBlock(target.blockName, {
			[target.attrName]: '#fff',
		});
		expect(result.ok).toBe(true);
	});
});

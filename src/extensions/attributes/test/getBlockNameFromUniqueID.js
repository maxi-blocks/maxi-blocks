import getBlockNameFromUniqueID from '@extensions/attributes/getBlockNameFromUniqueID';

describe('getBlockNameFromUniqueID', () => {
	it('Should extract block name from numeric suffix', () => {
		const result = getBlockNameFromUniqueID('accordion-maxi-123');
		expect(result).toBe('accordion-maxi');
	});

	it('Should extract block name from UUID suffix', () => {
		const result = getBlockNameFromUniqueID('accordion-maxi-1se8ef1z-u');
		expect(result).toBe('accordion-maxi');
	});

	it('Should handle multiple hyphens in block name', () => {
		const result = getBlockNameFromUniqueID('custom-block-name-123');
		expect(result).toBe('custom-block-name');
	});

	it('Should handle complex UUID suffixes', () => {
		const result = getBlockNameFromUniqueID('text-maxi-abcd1234-u');
		expect(result).toBe('text-maxi');
	});

	it('Should return original ID if no match found', () => {
		const result = getBlockNameFromUniqueID('invalid-format');
		expect(result).toBe('invalid-format');
	});

	it('Should handle empty string', () => {
		const result = getBlockNameFromUniqueID('');
		expect(result).toBe('');
	});

	it('Should handle IDs without suffix', () => {
		const result = getBlockNameFromUniqueID('button-maxi');
		expect(result).toBe('button-maxi');
	});
});

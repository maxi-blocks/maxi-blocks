import parseLongAttrKey from '../parseLongAttrKey';

describe('parseLongAttrKey', () => {
	it('should return the correct key', () => {
		expect(
			parseLongAttrKey('background-color-palette-status-general')
		).toBe('bc-p.s-general');

		expect(parseLongAttrKey('border-style-general')).toBe('bo-s-general');

		expect(parseLongAttrKey('background-layers')).toBe('bl');

		expect(
			parseLongAttrKey('background-color-palette-opacity-general')
		).toBe('bc-po-general');

		expect(parseLongAttrKey('box-shadow-palette-color')).toBe('bs-pc');
	});
});

import parseShortAttrKey from '../parseShortAttrKey';

describe('parseShortAttrKey', () => {
	it('should return the correct key', () => {
		expect(parseShortAttrKey('bc-p.s-general')).toBe(
			'background-color-palette-status-general'
		);
	});
});

import parseShortAttrKey from '../parseShortAttrKey';

describe('parseShortAttrKey', () => {
	it('should return the correct key', () => {
		const attributes = {
			'bc-ps-general': 'background-color-palette-status-general',
			'bo-s-general': 'border-style-general',
			bl: 'background-layers',
			'bc-po-general': 'background-color-palette-opacity-general',
			'bs-pc': 'box-shadow-palette-color',
			'bo-w.t-general': 'border-width-top-general',
			'p.t-general': 'padding-top-general',
			'm.t-general': 'margin-top-general',
			'bt-bo-w.t-general': 'button-border-width-top-general',
		};

		Object.entries(attributes).forEach(([key, value]) => {
			expect(parseShortAttrKey(key)).toBe(value);
		});
	});
});

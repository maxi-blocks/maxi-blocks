import parseLongAttrKey from '../parseLongAttrKey';

describe('parseLongAttrKey', () => {
	it('should return the correct key', () => {
		const attributes = {
			'background-color-palette-status-general': 'bc-ps-general',
			'border-style-general': 'bo-s-general',
			'background-layers': 'bl',
			'background-color-palette-opacity-general': 'bc-po-general',
			'box-shadow-palette-color': 'bs-pc',
			'border-width-top-general': 'bo-w.t-general',
			'padding-top-general': 'p.t-general',
			'margin-top-general': 'm.t-general',
			'background-image-opacity-general-hover': 'bi-o-general.h', // not sure about this .h part
			'divider-border-radius-general': 'db.ra-general',
			'icon-size': 'i-si',
			'active-icon-divider-border-custom-color-general':
				'a-i-db-cc-general',
			'line-status-hover': 'li.sh',
			'active-title-typography-status-active': 'a-ti-t.sa',
		};

		Object.entries(attributes).forEach(([key, value]) => {
			expect(parseLongAttrKey(key)).toBe(value);
		});
	});
});

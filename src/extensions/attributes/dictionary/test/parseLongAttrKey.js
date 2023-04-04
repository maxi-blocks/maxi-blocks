import parseLongAttrKey from '../parseLongAttrKey';

describe('parseLongAttrKey', () => {
	it('should return the correct key', () => {
		const attributes = {
			'background-color-palette-status-general': 'bc_ps-general',
			'border-style-general': 'bo_s-general',
			'background-layers': 'b_ly',
			'background-color-palette-opacity-general': 'bc_po-general',
			'box-shadow-palette-color': 'bs_pc',
			'border-width-top-general': 'bo_w.t-general',
			'padding-top-general': '_p.t-general',
			'margin-top-general': '_m.t-general',
			'background-image-opacity-general-hover': 'bi_o-general.h',
			'divider-border-radius-general': 'di-bo.ra-general',
			'icon-size': 'i_si',
			'active-icon-divider-border-custom-color-general':
				'a-i-di-bo_cc-general',
			'line-status-hover': '_li.sh',
			'active-title-typography-status-active': 'a-ti-t.sa',
			'active-icon-border-radius-top-left-general':
				'a-i-bo.ra.tl-general',
			'active-icon-stroke-palette-status': 'a-i-str_ps',
			'icon-inherit': 'i_i',
			'content-divider-border-top-general': 'c-di-bo.t-general',
			'content-line-status-hover': 'c_li.sh',
			'navigation-arrow-second-icon-content': 'nas-i_c',
			'active-icon-width-fit-content-general': 'a-i_wfc-general',
			'active-icon-background-gradient-content-general':
				'a-i-bg_c-general',
			'background-video-opacity-general': 'bv_o-general',
		};

		Object.entries(attributes).forEach(([key, value]) => {
			expect(parseLongAttrKey(key)).toBe(value);
		});
	});
});

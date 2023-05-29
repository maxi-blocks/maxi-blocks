import parseLongAttrKey from '../parseLongAttrKey';

describe('parseLongAttrKey', () => {
	it('should return the correct key', () => {
		const attributes = {
			'background-color-palette-status-g': 'bc_ps-g',
			'border-style-g': 'bo_s-g',
			'background-layers': 'b_ly',
			'background-color-palette-opacity-g': 'bc_po-g',
			'box-shadow-palette-color': 'bs_pc',
			'border-width-top-g': 'bo_w.t-g',
			'padding-top-g': '_p.t-g',
			'margin-top-g': '_m.t-g',
			'background-image-opacity-g-hover': 'bi_o-g.h',
			'divider-border-radius-g': 'di-bo.ra-g',
			'icon-size': 'i_si',
			'active-icon-divider-border-custom-color-g': 'a-i-di-bo_cc-g',
			'line-status-hover': '_li.sh',
			'active-title-typography-status-active': 'a-ti-t.sa',
			'active-icon-border-radius-top-left-g': 'a-i-bo.ra.tl-g',
			'active-icon-stroke-palette-status': 'a-i-str_ps',
			'icon-inherit': 'i_i',
			'content-divider-border-top-g': 'c-di-bo.t-g',
			'content-line-status-hover': 'c_li.sh',
			'navigation-arrow-second-icon-content': 'nas-i_c',
			'active-icon-width-fit-content-g': 'a-i_wfc-g',
			'active-icon-background-gradient-content-g': 'a-i-bg_c-g',
			'background-video-opacity-g': 'bv_o-g',
		};

		Object.entries(attributes).forEach(([key, value]) => {
			expect(parseLongAttrKey(key)).toBe(value);
		});
	});
});

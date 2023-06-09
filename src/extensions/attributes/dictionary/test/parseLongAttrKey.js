import parseLongAttrKey from '../parseLongAttrKey';

describe('parseLongAttrKey', () => {
	it('should return the correct key', () => {
		const attributes = {
			'background-color-palette-status-general': 'bc_ps-g',
			'border-style-general': 'bo_s-g',
			'background-layers': 'b_ly',
			'background-color-palette-opacity-general': 'bc_po-g',
			'box-shadow-palette-color': 'bs_pc',
			'border-width-top-general': 'bo_w.t-g',
			'padding-top-general': '_p.t-g',
			'margin-top-general': '_m.t-g',
			'background-image-opacity-general-hover': 'bi_o-g.h',
			'divider-border-radius-general': 'di-bo.ra-g',
			'icon-size': 'i_si',
			'active-icon-divider-border-custom-color-general': 'a-i-di-bo_cc-g',
			'line-status-hover': 'li.sh',
			'active-title-typography-status-active': 'a-ti-t.sa',
			'active-icon-border-radius-top-left-general': 'a-i-bo.ra.tl-g',
			'active-icon-stroke-palette-status': 'a-i-str_ps',
			'icon-inherit': 'i_i',
			'content-divider-border-top-general': 'c-di-bo.t-g',
			'content-line-status-hover': 'c-li.sh',
			'navigation-arrow-second-icon-content': 'nas-i_c',
			'active-icon-width-fit-content-general': 'a-i_wfc-g',
			'active-icon-background-gradient-content-general': 'a-i-bg_c-g',
			'background-video-opacity-general': 'bv_o-g',
			'scroll-blur-preview-status-general': 'sc_blu.ps-g',
		};

		Object.entries(attributes).forEach(([key, value]) => {
			expect(parseLongAttrKey(key)).toBe(value);
		});
	});
});

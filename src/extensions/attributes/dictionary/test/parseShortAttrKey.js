import parseShortAttrKey from '../parseShortAttrKey';

describe('parseShortAttrKey', () => {
	it('should return the correct key', () => {
		const attributes = {
			'bc_ps-g': 'background-color-palette-status-g',
			'bo_s-g': 'border-style-g',
			b_ly: 'background-layers',
			'bc_po-g': 'background-color-palette-opacity-g',
			bs_pc: 'box-shadow-palette-color',
			'bo_w.t-g': 'border-width-top-g',
			'_p.t-g': 'padding-top-g',
			'_m.t-g': 'margin-top-g',
			'bt-bo_w.t-g': 'button-border-width-top-g',
			a_st: 'active-svgType',
			'a-i_w.u-g': 'active-icon-width-unit-g',
			'a-i-s_ps': 'active-icon-svg-palette-status',
			'a-i-bcw_pos.sy-g':
				'active-icon-background-color-wrapper-position-sync-g',
			'i_spa-g.h': 'icon-spacing-g-hover',
			'i_h.u-g.h': 'icon-height-unit-g-hover',
			'a-i-bo.ra.tl-g': 'active-icon-border-radius-top-left-g',
			'he-di-bo_s-g': 'header-divider-border-style-g',
			'a-i_spa.u-g': 'active-icon-spacing-unit-g',
			i_i: 'icon-inherit',
			'ti_ti.u-g': 'title-text-indent-unit-g',
			'a-i_i': 'active-icon-inherit',
			'c-di-bo.t-g': 'content-divider-border-top-g',
			'bv_et-g': 'background-video-endTime-g',
		};

		Object.entries(attributes).forEach(([key, value]) => {
			expect(parseShortAttrKey(key)).toBe(value);
		});
	});
});

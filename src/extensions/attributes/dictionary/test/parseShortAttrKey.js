import parseShortAttrKey from '../parseShortAttrKey';

describe('parseShortAttrKey', () => {
	it('should return the correct key', () => {
		const attributes = {
			'bc_ps-g': 'background-color-palette-status-general',
			'bo_s-g': 'border-style-general',
			b_ly: 'background-layers',
			'bc_po-g': 'background-color-palette-opacity-general',
			bs_pc: 'box-shadow-palette-color',
			'bo_w.t-g': 'border-width-top-general',
			'_p.t-g': 'padding-top-general',
			'_m.t-g': 'margin-top-general',
			'bt-bo_w.t-g': 'button-border-width-top-general',
			a_st: 'active-svgType',
			'a-i_w.u-g': 'active-icon-width-unit-general',
			'a-i-s_ps': 'active-icon-svg-palette-status',
			'a-i-bcw_pos.sy-g':
				'active-icon-background-color-wrapper-position-sync-general',
			'i_spa-g.h': 'icon-spacing-general-hover',
			'i_h.u-g.h': 'icon-height-unit-general-hover',
			'a-i-bo.ra.tl-g': 'active-icon-border-radius-top-left-general',
			'he-di-bo_s-g': 'header-divider-border-style-general',
			'a-i_spa.u-g': 'active-icon-spacing-unit-general',
			i_i: 'icon-inherit',
			'ti_ti.u-g': 'title-text-indent-unit-general',
			'a-i_i': 'active-icon-inherit',
			'c-di-bo.t-g': 'content-divider-border-top-general',
			'bv_et-g': 'background-video-endTime-general',
		};

		Object.entries(attributes).forEach(([key, value]) => {
			expect(parseShortAttrKey(key)).toBe(value);
		});
	});
});

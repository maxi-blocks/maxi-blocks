import parseShortAttrKey from '../parseShortAttrKey';

describe('parseShortAttrKey', () => {
	it('should return the correct key', () => {
		const attributes = {
			'bc_ps-general': 'background-color-palette-status-general',
			'bo_s-general': 'border-style-general',
			_bl: 'background-layers',
			'bc_po-general': 'background-color-palette-opacity-general',
			bs_pc: 'box-shadow-palette-color',
			'bo_w.t-general': 'border-width-top-general',
			'_p.t-general': 'padding-top-general',
			'_m.t-general': 'margin-top-general',
			'bt-bo_w.t-general': 'button-border-width-top-general',
			a_st: 'active-svgType',
			'a-i_w.u-general': 'active-icon-width-unit-general',
			'a-i-s_ps': 'active-icon-svg-palette-status',
			'a-i-bcw_pos.sy-general':
				'active-icon-background-color-wrapper-position-sync-general',
			'i_spa-general.h': 'icon-spacing-general-hover',
			'i_h.u-general.h': 'icon-height-unit-general-hover',
			'a-i-bo.ra.tl-general':
				'active-icon-border-radius-top-left-general',
			'he_db_s-general': 'header-divider-border-style-general',
			'a-i_spa.u-general': 'active-icon-spacing-unit-general',
			i_i: 'icon-inherit',
			'ti_ti.u-general': 'title-text-indent-unit-general',
			'a-i_i': 'active-icon-inherit',
			'c-di-bo.t-general': 'content-divider-border-top-general',
			'bv_et-general': 'background-video-endTime-general',
		};

		Object.entries(attributes).forEach(([key, value]) => {
			expect(parseShortAttrKey(key)).toBe(value);
		});
	});
});

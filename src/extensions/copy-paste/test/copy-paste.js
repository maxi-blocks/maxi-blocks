import getOrganizedAttributes from '../getOrganizedAttributes';
import { copyPasteMapping } from '../../../blocks/image-maxi/data';

jest.mock('src/components/index.js', () => jest.fn());
jest.mock('src/extensions/dom/dom.js', () => jest.fn());

describe('getOrganizedAttributes', () => {
	it('Ensure it works with simple copy paste object', () => {
		const copyPasteMapping = {
			settings: {
				Content: 'content',
				Alt: 'alt',
			},
			advanced: {
				Class: 'class',
				Style: 'style',
			},
		};

		const attributes = {
			content: 'Test',
			alt: 'Alt text',
			class: 'class text',
			style: 'style text',
		};

		const result = getOrganizedAttributes(attributes, copyPasteMapping);
		expect(result).toMatchSnapshot();
	});

	it('Ensure it works with groups', () => {
		const copyPasteMapping = {
			settings: {
				Content: {
					group: {
						Content: 'content',
						'Content on close': 'closeContent',
					},
				},
			},
		};

		const attributes = {
			content: 'Test',
			closeContent: 'Test on close',
		};

		const result = getOrganizedAttributes(attributes, copyPasteMapping);
		expect(result).toMatchSnapshot();
	});

	it('Ensure it works with multiple nested groups', () => {
		const copyPasteMapping = {
			settings: {
				Content: {
					group: {
						Content: 'content',
						'Content settings': {
							group: {
								'Content font size': 'fontSize',
								'Content font weight': 'fontWeight',
							},
						},
					},
				},
			},
		};

		const attributes = {
			content: 'Test',
			fontSize: '12px',
			fontWeight: 'bold',
		};

		const result = getOrganizedAttributes(attributes, copyPasteMapping);
		expect(result).toMatchSnapshot();
	});

	it('Ensure it works with responsive attributes', () => {
		const copyPasteMapping = {
			settings: {
				Width: {
					props: '_w',
					hasBreakpoints: true,
				},
			},
		};

		const attributes = {
			'_w-g': '80%',
			'_w-l': undefined,
			'_w-m': '100%',
			'_w-s': '50%',
			'_w-xs': '60%',
			'_w-xxl': '95%',
		};

		const result = getOrganizedAttributes(attributes, copyPasteMapping);
		expect(result).toMatchSnapshot();
	});

	it('Ensure it works with prefixes', () => {
		const copyPasteMapping = {
			settings: {
				Width: {
					group: {
						'Column width': {
							props: '_w',
							prefix: 'column-',
						},
						'Row width': '_w',
					},
					// Checking if row will take this prefix and column prefix will be overridden by his own
					prefix: 'row-',
				},
			},
		};

		const attributes = {
			'row-width': '80%',
			'column-width': '100%',
		};

		const result = getOrganizedAttributes(attributes, copyPasteMapping);
		expect(result).toMatchSnapshot();
	});

	it('Ensure it works with palette', () => {
		const copyPasteMapping = {
			settings: {
				Color: {
					props: 'text',
					isPalette: true,
				},
			},
		};

		const attributes = {
			text_ps: true,
			text_pc: 4,
			text_po: 0.5,
			text_cc: '#fff',
		};

		const result = getOrganizedAttributes(attributes, copyPasteMapping);
		expect(result).toMatchSnapshot();
	});

	it('Ensure it works with group attributes', () => {
		const copyPasteMapping = {
			settings: {
				Overflow: {
					groupAttributes: 'overflow',
				},
			},
		};

		const attributes = {
			'_ox-g': 'visible',
			'_oy-g': 'hidden',
			'_ox-xxl': 'hidden',
			'_oy-xxl': 'visible',
			'_ox-xl': 'auto',
			'_oy-xl': 'clip',
			'_ox-l': 'clip',
			'_oy-l': 'auto',
			'_ox-m': 'scroll',
			'_oy-m': 'scroll',
			'_ox-s': 'auto',
			'_oy-s': 'auto',
			'_ox-xs': 'visible',
			'_oy-xs': 'visible',
			// add some random attributes to check if they are not copied
			text_ps: true,
			text_pc: 4,
			text_po: 0.5,
			text_cc: '#fff',
		};

		const result = getOrganizedAttributes(attributes, copyPasteMapping);
		expect(result).toMatchSnapshot();
	});

	it('Ensure it works with group attributes with prefix', () => {
		const copyPasteMapping = {
			settings: {
				Overflow: {
					groupAttributes: 'overflow',
					prefix: 'row-',
				},
			},
		};

		const attributes = {
			'row_ox-g': 'visible',
			'row_oy-g': 'hidden',
			'_ox-xxl': 'hidden',
			'row_oy-xxl': 'visible',
			'_ox-xl': 'auto',
			'row_oy-xl': 'clip',
			'_ox-l': 'clip',
			'_oy-l': 'auto',
			'row_ox-m': 'scroll',
			'_oy-m': 'scroll',
			'row_ox-s': 'auto',
			'_oy-s': 'auto',
			'row_ox-xs': 'visible',
			'_oy-xs': 'visible',
			// add some random attributes to check if they are not copied
			text_ps: true,
			'row-text_pc': 4,
			text_po: 0.5,
			'row-text_cc': '#fff',
		};

		const result = getOrganizedAttributes(attributes, copyPasteMapping);
		expect(result).toMatchSnapshot();
	});

	it('Should ignore groups, which have names that start with underscore', () => {
		const copyPasteMapping = {
			settings: {
				Width: {
					props: '_w',
					hasBreakpoints: true,
				},
				_Height: {
					props: '_h',
					hasBreakpoints: true,
				},
			},
			_exclude: [
				'some attribute (they are excluded by another function, so dont care)',
			],
			_notSettings: {
				Height: {
					props: '_h',
					hasBreakpoints: true,
				},
			},
		};
		const attributes = {
			'_w-g': '80%',
			'_w-l': undefined,
			'_w-m': '100%',
			'_w-s': '50%',
			'_w-xs': '60%',
			'_w-xxl': '95%',
			'_h-g': '80%',
			'_h-l': undefined,
			'_h-m': '100%',
			'_h-s': '50%',
			'_h-xs': '60%',
			'_h-xxl': '95%',
		};

		const result = getOrganizedAttributes(attributes, copyPasteMapping);
		expect(result).toMatchSnapshot();
	});

	it('Ensure it works with multiple conditions', () => {
		const copyPasteMapping = {
			settings: {
				Color: {
					group: {
						Color: ['fill', 'line'],
						'Color on hover': {
							props: ['fill', 'line'],
							isHover: true,
						},
					},
					hasBreakpoints: true,
					isPalette: true,
					prefix: 'row-',
				},
			},
		};

		const attributes = {
			// Fill
			'row-fill_cc-g.h': null,
			'color-g': null,
			'row-fill_cc-l.h': null,
			'color-fill-fill-l': null,
			'row_cc-m.h': 'rgba(43,108,153,0.85)',
			'color-fill-m': 'rgba(166,105,105,0.44)',
			'row-fill_cc-s.h': 'rgba(43,108,153,0.85)',
			'color-s': 'rgba(166,105,105,0.44)',
			'row-fill_cc-xs.h': 'rgba(43,108,153,0.85)',
			'color-xs': 'rgba(166,105,105,0.44)',
			'row-fill_pc-g.h': 6,
			'row-fill_cc-g': 4,
			'row_pc-l.h': 7,
			'row-fill_pc-l': 5,
			'row_pc-m.h': 7,
			'line-fill_pc-m': 5,
			'row-fill_pc-s.h': 6,
			'row-fill_pc-s': 3,
			'row_pc-xs.h': 3,
			'palette-fill_cc-xs': 8,
			'row_po-g.h': 1,
			'palette-fill-opacity-g': 1,
			'row-fill_po-l.h': 0.52,
			'_po-l': 0.44,
			'row-fill_po-m.h': 0.85,
			'_po-m': 0.44,
			'row-fill_po-s.h': 1,
			'palette-fill-opacity-s': 1,
			'row-fill_po-xs.h': 0.58,
			'_po-xs': 0.06,
			'row-fill_ps-g.h': true,
			'_ps-g': true,
			'row-fill_ps-l.h': true,
			'palette-fill.s-l': true,
			'row_ps-m.h': false,
			'palette-fill.s-m': false,
			'row_ps-s.h': true,
			'palette-fill.s-s': true,
			'row-fill_ps-xs.h': true,
			'palette-fill.s-xs': true,
			// Line
			'row_cc-g.h': null,
			'color-line-g': null,
			'row-line_cc-l.h': null,
			'color-l': null,
			'row-line_cc-m.h': 'rgba(43,108,153,0.85)',
			'color-m': 'rgba(166,105,105,0.44)',
			'row_cc-s.h': 'rgba(43,108,153,0.85)',
			'color-line-s': 'rgba(166,105,105,0.44)',
			'row-line_cc-xs.h': 'rgba(43,108,153,0.85)',
			'row_pc-g.h': 6,
			'_pc-g': 4,
			'row-line_pc-l.h': 7,
			'palette-line_cc-l': 5,
			'_pc-m': 5,
			'row_pc-s.h': 6,
			'palette-line_cc-s': 3,
			'_pc-xs': 8,
			'palette-line-opacity-g': 1,
			'row-line_po-l.h': 0.52,
			'palette-line-opacity-l': 0.44,
			'row-line_po-m.h': 0.85,
			'row_po-s.h': 1,
			'palette-line-opacity-s': 1,
			'row_po-xs.h': 0.58,
			'row_ps-g.h': true,
			'row-line_ps-l.h': true,
			'_ps-l': true,
			'row-line_ps-m.h': false,
			'palette-line.s-m': false,
			'palette-line.s-s': true,
			'row_ps-xs.h': true,
			'palette-line.s-xs': true,
			// Other attributes to check if they are not copied
			blockStyle: 'light',
			'column-gap.u-g': 'px',
			customLabel: 'Text_1',
			'flex-basis.u-g': 'px',
			'font-size.u-g': 'px',
			'full-width-g': 'normal',
			'_h.u-g': 'px',
			isFirstOnHierarchy: true,
			'letter-spacing.u-g': 'px',
			'_lhe.u-g': 'px',
			'l_pc-g': 4,
			'l_ps-g': true,
			'_mh.u-g': 'px',
			'_mw.u-g': 'px',
			'_mih.u-g': 'px',
			'_miw.u-g': 'px',
			'_ox-g': 'visible',
			'_oy-g': 'visible',
			'_p.b.u-g': 'px',
			'_p-g': 'inherit',
			'_p.l.u-g': 'px',
			'_p.r.u-g': 'px',
			'_p.sy-g': 'all',
			'_p.t.u-g': 'px',
			'_rg.u-g': 'px',
			_sao: false,
			'_tin.u-g': 'px',
			't.sh': true,
			_uid: 'text-maxi-1',
			'_wfc-g': false,
			'_w.u-g': 'px',
		};

		const result = getOrganizedAttributes(attributes, copyPasteMapping);
		expect(result).toMatchSnapshot();
	});

	it('Ensure getOrganizedAttributes work correctly with image copy-paste', () => {
		const object = {
			defaultBlockStyle: 'maxi-def-light',
			_cl: 'Image',
			_fw: 'normal',
			'_a-g': 'right',
			_ir: 'original',
			_ct: 'custom',
			_cco: 'Basket Ball',
			_cpo: 'bottom',
			'_cga-g': 2,
			'_cga.u-g': 'em',
			_is: 'full',
			_iiu: false,
			_as: 'title',
			_iw: 82,
			'_cp.s-g': false,
			'_l_ps-g': true,
			'_l_pc-g': 4,
			'_lih_ps-g': true,
			'_lih_pc-g': 6,
			'_lia_ps-g': true,
			'_lia_pc-g': 6,
			'_liv_ps-g': true,
			'_liv_pc-g': 6,
			'_ps-g': true,
			'_pc-g': 3,
			'_fs.u-g': 'px',
			'_lhe.u-g': 'px',
			'_ls.u-g': 'px',
			'_tin.u-g': 'px',
			h_ty: 'none',
			h_pr: true,
			h_ex: false,
			h_bet: 'zoom-in',
			h_tety: 'fade',
			h_tp: 'center-center',
			h_te: 'easing',
			h_tdu: 0.5,
			h_bziv: 1.3,
			h_bzov: 1.5,
			h_bsv: 30,
			h_brv: 15,
			h_bbv: 2,
			'h-b.s': false,
			'h-bc_ps-g': true,
			'h-bc_pc-g': 1,
			'h-bc_cp.s-g': false,
			'h-bg_o-g': 1,
			'h-bg_cp.s-g': false,
			'h-bo_ps-g': true,
			'h-bo_pc-g': 2,
			'h-bo.s': false,
			'h-bo.ra.sy-g': 'all',
			'h-bo.ra.u-g': 'px',
			'h-bo_w_t-g': 2,
			'h-bo_w_r-g': 2,
			'h-bo_w_b-g': 2,
			'h-bo_w_l-g': 2,
			'h-bo_w.sy-g': 'all',
			'h-bo_w.u-g': 'px',
			'hc_ps-g': true,
			'hc_pc-g': 1,
			'hc_fs.u-g': 'px',
			'hc_fs-g': 18,
			'hc_lhe.u-g': 'px',
			'hc_ls.u-g': 'px',
			'hc_tin.u-g': 'px',
			'hc-t.s': false,
			'hc-t_c': 'Add your Hover Title here',
			'h_m_sy-g': 'all',
			'h_m.t.u-g': 'px',
			'h_m_r.u-g': 'px',
			'h_m.b.u-g': 'px',
			'h_m.l.u-g': 'px',
			'h_m.s': false,
			'h_p.t.u-g': 'px',
			'h_p_r.u-g': 'px',
			'h_p.b.u-g': 'px',
			'h_p.l.u-g': 'px',
			'h_p_sy-g': 'all',
			'h_p.s': false,
			'h-ti_ps-g': true,
			'h-ti_pc-g': 1,
			'h-ti_fs.u-g': 'px',
			'h-ti_fs-g': 30,
			'h-ti_lhe.u-g': 'px',
			'h-ti_ls.u-g': 'px',
			'h-ti_tin.u-g': 'px',
			'h-ti-t.s': false,
			'h-ti-t_c': 'Add your Hover Title here',
			'im-bo_ps-g': true,
			'im-bo_pc-g': 7,
			'im-bo_ps-g.h': true,
			'im-bo_pc-g.h': 4,
			'im-bo.sh': true,
			'im-bo.ra.sy-g': 'all',
			'im-bo.ra.u-g': 'px',
			'im-bo.ra.u-g.h': 'px',
			'im-bo_w.t-g': 3,
			'im-bo_w_r-g': 3,
			'im-bo_w.b-g': 3,
			'im-bo_w.l-g': 3,
			'im-bo_w.sy-g': 'all',
			'im-bo_w.u-g': 'px',
			'im-bs_ps-g': true,
			'im-bs_pc-g': 8,
			'im-bs_pc-g.h': 6,
			'im-bs.sh': false,
			im_sao: false,
			'im_mw.u-g': 'px',
			'im_w.u-g': 'px',
			'im_w-fit_c-g': false,
			'im_miw.u-g': 'px',
			'im_mh.u-g': 'px',
			'im_h.u-g': 'px',
			'im_mih.u-g': 'px',
			'im_p.t.u-g': 'px',
			'im_p_r.u-g': 'px',
			'im_p.b.u-g': 'px',
			'im_p.l.u-g': 'px',
			'im_p.sy-g': 'all',
			'bb.sh': false,
			'bo_ps-g': true,
			'bo_pc-g': 2,
			'bo_ps-g.h': true,
			'bo_pc-g.h': 6,
			'bo.sh': false,
			'bo.ra.sy-g': 'all',
			'bo.ra.u-g': 'px',
			'bo.ra.u-g.h': 'px',
			'bo_w.t-g': 2,
			'bo_w_r-g': 2,
			'bo_w.b-g': 2,
			'bo_w.l-g': 2,
			'bo_w.sy-g': 'all',
			'bo_w.u-g': 'px',
			'bs_ps-g': true,
			'bs_pc-g': 5,
			'bs_pc-g.h': 6,
			'bs.sh': false,
			_sao: false,
			'_mw.u-g': 'px',
			'_w.u-g': 'px',
			'_wfc-g': false,
			'_miw.u-g': 'px',
			'_mh.u-g': 'px',
			'_h.u-g': 'px',
			'_mih.u-g': 'px',
			'_m.sy-g': 'all',
			'_m.t.u-g': 'px',
			'_m_r.u-g': 'px',
			'_m.b.u-g': 'px',
			'_m.l.u-g': 'px',
			'_p.t.u-g': 'px',
			'_p_r.u-g': 'px',
			'_p.b.u-g': 'px',
			'_p.l.u-g': 'px',
			'_p.sy-g': 'all',
			_sef: 0,
			'sc_v.s-g': false,
			'sc_v.ps-g': false,
			'sc_v_ea-g': 'ease',
			'sc_v_spe-g': 500,
			'sc_v_de-g': 0,
			'sc_v_vpt-g': 'mid',
			'sc_v_sr-g': true,
			'sc_v_of_sta-g': -400,
			'sc_v_of.m-g': 0,
			'sc_v_of_e-g': 400,
			'sc_ho.s-g': false,
			'sc_ho.ps-g': false,
			'sc_ho_ea-g': 'ease',
			'sc_ho_spe-g': 500,
			'sc_ho_de-g': 0,
			'sc_ho_vpt-g': 'mid',
			'sc_ho_sr-g': true,
			'sc_ho_of_sta-g': -200,
			'sc_ho_of.m-g': 0,
			'sc_ho_of_e-g': 200,
			'sc_rot.s-g': false,
			'sc_rot.ps-g': false,
			'sc_rot_ea-g': 'ease',
			'sc_rot_spe-g': 500,
			'sc_rot_de-g': 0,
			'sc_rot_vpt-g': 'mid',
			'sc_rot_sr-g': true,
			'sc_rot_rot_sta-g': 90,
			'sc_rot_rot.m-g': 0,
			'sc_rot_rot_e-g': 0,
			'sc_sc.s-g': false,
			'sc_sc.ps-g': false,
			'sc_sc_ea-g': 'ease',
			'sc_sc_spe-g': 500,
			'sc_sc_de-g': 0,
			'sc_sc_vpt-g': 'mid',
			'sc_sc_sr-g': true,
			'sc_sc_sc_sta-g': 70,
			'sc_sc_sc.m-g': 100,
			'sc_sc_sc_e-g': 100,
			'sc_fa.s-g': false,
			'sc_fa.ps-g': false,
			'sc_fa_ea-g': 'ease',
			'sc_fa_spe-g': 500,
			'sc_fa_de-g': 0,
			'sc_fa_vpt-g': 'mid',
			'sc_fa_sr-g': true,
			'sc_fa-opacity_sta-g': 0,
			'sc_fa-opacity.m-g': 100,
			'sc_fa-opacity_e-g': 100,
			'sc_blu.s-g': false,
			'sc_blu.ps-g': false,
			'sc_blu_ea-g': 'ease',
			'sc_blu_spe-g': 500,
			'sc_blu_de-g': 0,
			'sc_blu_vpt-g': 'mid',
			'sc_blu_sr-g': true,
			'sc_blu_blu_sta-g': 10,
			'sc_blu_blu.m-g': 0,
			'sc_blu_blu_e-g': 0,
			'tr_tr-x.u-g': '%',
			'tr_tr-y.u-g': '%',
			'tr-origin-x.u-g': '%',
			'tr-origin-y.u-g': '%',
			'_p.u-g': 'px',
			'_fb.u-g': 'px',
			'_rg.u-g': 'px',
			'_cg.u-g': 'px',
			_uid: 'image-maxi-331',
			_ioh: true,
			_bs: 'maxi-light',
			parentBlockStyle: 'light',
			_mi: 22,
			_mu: 'http://localhost:8888/wp_c/uploads/2022/04/ball.jpg',
			_mw: 225,
			_mh: 225,
			_mal: 'ball',
			'_ta-g': 'center',
			_se: '<svg viewBox="0 0 36.1 36.1" class="heart-54-shape-maxi-svg" data-item="image-maxi-331__svg"><pattern id="image-maxi-331__428__img" class="maxi-svg-block__pattern" width="100%" height="100%" x="0" y="0" patternunits="userSpaceOnUse"><image class="maxi-svg-block__pattern__image" width="100%" height="100%" x="0" y="0" href="http://localhost:8888/wp_c/uploads/2022/04/ball.jpg" preserveaspectratio="xMidYMid slice"></image></pattern><path fill="url(#image-maxi-331__428__img)" data-fill="" fill-rule="evenodd" d="M2.2 6.2h0c2.7-2.7 7.2-2.7 10 0L18 12l5.8-5.8c2.7-2.7 7.2-2.7 10 0h0c2.7 2.7 2.7 7.2 0 10L18 32 2.2 16.2c-2.7-2.8-2.7-7.3 0-10h0z" style="fill: url(#image-maxi-331__428__img)"></path></svg>',
			_sd: {
				'image-maxi-331__428': {
					color: '',
					imageID: 22,
					imageURL:
						'http://localhost:8888/wp_c/uploads/2022/04/ball.jpg',
				},
			},
			'im-bo_s-g': 'dashed',
			'im-bo.ra_tl-g': 71,
			'im-bo.ra_tr-g': 71,
			'im-bo.ra_br-g': 71,
			'im-bo.ra_bl-g': 71,
			'im-bo_s-g.h': 'dashed',
			'im-bo_w.t-g.h': 3,
			'im-bo_w.r-g.h': 3,
			'im-bo_w.b-g.h': 3,
			'im-bo_w.l-g.h': 3,
			'im-bo_w.sy-g.h': 'all',
			'im-bo_w.u-g.h': 'px',
			'im-bo.ra_tl-g.h': 71,
			'im-bo.ra_tr-g.h': 71,
			'im-bo.ra_br-g.h': 71,
			'im-bo.ra_bl-g.h': 71,
			'im-bo.ra.sy-g.h': 'all',
			'bs_po-g': 0.23,
			'bs_ho-g': 0,
			'bs_v-g': 30,
			'bs_blu-g': 50,
			'bs_sp-g': 0,
			'tr_sc-x-g': 65,
			'tr_sc-y-g': 110,
		};

		const result = getOrganizedAttributes(object, copyPasteMapping);
		expect(result).toMatchSnapshot();

		const result2 = getOrganizedAttributes(object, copyPasteMapping, true);
		expect(result2).toMatchSnapshot();
	});
});

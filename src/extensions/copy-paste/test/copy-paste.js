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
			'_w-general': '80%',
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
			'_ox-general': 'visible',
			'_oy-general': 'hidden',
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
			'row_ox-general': 'visible',
			'row_oy-general': 'hidden',
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
			'_w-general': '80%',
			'_w-l': undefined,
			'_w-m': '100%',
			'_w-s': '50%',
			'_w-xs': '60%',
			'_w-xxl': '95%',
			'_h-general': '80%',
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
			'row-fill_cc-general.h': null,
			'color-general': null,
			'row-fill_cc-l.h': null,
			'color-fill-fill-l': null,
			'row_cc-m.h': 'rgba(43,108,153,0.85)',
			'color-fill-m': 'rgba(166,105,105,0.44)',
			'row-fill_cc-s.h': 'rgba(43,108,153,0.85)',
			'color-s': 'rgba(166,105,105,0.44)',
			'row-fill_cc-xs.h': 'rgba(43,108,153,0.85)',
			'color-xs': 'rgba(166,105,105,0.44)',
			'row-fill_pc-general.h': 6,
			'row-fill_cc-general': 4,
			'row_pc-l.h': 7,
			'row-fill_pc-l': 5,
			'row_pc-m.h': 7,
			'line-fill_pc-m': 5,
			'row-fill_pc-s.h': 6,
			'row-fill_pc-s': 3,
			'row_pc-xs.h': 3,
			'palette-fill_cc-xs': 8,
			'row_po-general.h': 1,
			'palette-fill-opacity-general': 1,
			'row-fill_po-l.h': 0.52,
			'_po-l': 0.44,
			'row-fill_po-m.h': 0.85,
			'_po-m': 0.44,
			'row-fill_po-s.h': 1,
			'palette-fill-opacity-s': 1,
			'row-fill_po-xs.h': 0.58,
			'_po-xs': 0.06,
			'row-fill_ps-general.h': true,
			'_ps-general': true,
			'row-fill_ps-l.h': true,
			'palette-fill.s-l': true,
			'row_ps-m.h': false,
			'palette-fill.s-m': false,
			'row_ps-s.h': true,
			'palette-fill.s-s': true,
			'row-fill_ps-xs.h': true,
			'palette-fill.s-xs': true,
			// Line
			'row_cc-general.h': null,
			'color-line-general': null,
			'row-line_cc-l.h': null,
			'color-l': null,
			'row-line_cc-m.h': 'rgba(43,108,153,0.85)',
			'color-m': 'rgba(166,105,105,0.44)',
			'row_cc-s.h': 'rgba(43,108,153,0.85)',
			'color-line-s': 'rgba(166,105,105,0.44)',
			'row-line_cc-xs.h': 'rgba(43,108,153,0.85)',
			'row_pc-general.h': 6,
			'_pc-general': 4,
			'row-line_pc-l.h': 7,
			'palette-line_cc-l': 5,
			'_pc-m': 5,
			'row_pc-s.h': 6,
			'palette-line_cc-s': 3,
			'_pc-xs': 8,
			'palette-line-opacity-general': 1,
			'row-line_po-l.h': 0.52,
			'palette-line-opacity-l': 0.44,
			'row-line_po-m.h': 0.85,
			'row_po-s.h': 1,
			'palette-line-opacity-s': 1,
			'row_po-xs.h': 0.58,
			'row_ps-general.h': true,
			'row-line_ps-l.h': true,
			'_ps-l': true,
			'row-line_ps-m.h': false,
			'palette-line.s-m': false,
			'palette-line.s-s': true,
			'row_ps-xs.h': true,
			'palette-line.s-xs': true,
			// Other attributes to check if they are not copied
			blockStyle: 'light',
			'column-gap.u-general': 'px',
			customLabel: 'Text_1',
			'flex-basis.u-general': 'px',
			'font-size.u-general': 'px',
			'full-width-general': 'normal',
			'_h.u-general': 'px',
			isFirstOnHierarchy: true,
			'letter-spacing.u-general': 'px',
			'_lhe.u-general': 'px',
			'l_pc-general': 4,
			'l_ps-general': true,
			'_mh.u-general': 'px',
			'_mw.u-general': 'px',
			'_mih.u-general': 'px',
			'_miw.u-general': 'px',
			'_ox-general': 'visible',
			'_oy-general': 'visible',
			'_p.b.u-general': 'px',
			'_p-general': 'inherit',
			'_p.l.u-general': 'px',
			'_p.r.u-general': 'px',
			'_p.sy-general': 'all',
			'_p.t.u-general': 'px',
			'_rg.u-general': 'px',
			_sao: false,
			'_tin.u-general': 'px',
			't.sh': true,
			_uid: 'text-maxi-1',
			'_wfc-general': false,
			'_w.u-general': 'px',
		};

		const result = getOrganizedAttributes(attributes, copyPasteMapping);
		expect(result).toMatchSnapshot();
	});

	it('Ensure getOrganizedAttributes work correctly with image copy-paste', () => {
		const object = {
			defaultBlockStyle: 'maxi-def-light',
			_cl: 'Image',
			_fw: 'normal',
			'_a-general': 'right',
			_ir: 'original',
			_ct: 'custom',
			_cco: 'Basket Ball',
			_cpo: 'bottom',
			'_cga-general': 2,
			'_cga.u-general': 'em',
			_is: 'full',
			_iiu: false,
			_as: 'title',
			_iw: 82,
			'_cp.s-general': false,
			'_l_ps-general': true,
			'_l_pc-general': 4,
			'_lih_ps-general': true,
			'_lih_pc-general': 6,
			'_lia_ps-general': true,
			'_lia_pc-general': 6,
			'_liv_ps-general': true,
			'_liv_pc-general': 6,
			'_ps-general': true,
			'_pc-general': 3,
			'_fs.u-general': 'px',
			'_lhe.u-general': 'px',
			'_ls.u-general': 'px',
			'_tin.u-general': 'px',
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
			'h-bc_ps-general': true,
			'h-bc_pc-general': 1,
			'h-bc_cp.s-general': false,
			'h-bg_o-general': 1,
			'h-bg_cp.s-general': false,
			'h-bo_ps-general': true,
			'h-bo_pc-general': 2,
			'h-bo.s': false,
			'h-bo.ra.sy-general': 'all',
			'h-bo.ra.u-general': 'px',
			'h-bo_w_t-general': 2,
			'h-bo_w_r-general': 2,
			'h-bo_w_b-general': 2,
			'h-bo_w_l-general': 2,
			'h-bo_w.sy-general': 'all',
			'h-bo_w.u-general': 'px',
			'hc_ps-general': true,
			'hc_pc-general': 1,
			'hc_fs.u-general': 'px',
			'hc_fs-general': 18,
			'hc_lhe.u-general': 'px',
			'hc_ls.u-general': 'px',
			'hc_tin.u-general': 'px',
			'hc-t.s': false,
			'hc-t_c': 'Add your Hover Title here',
			'h_m_sy-general': 'all',
			'h_m.t.u-general': 'px',
			'h_m_r.u-general': 'px',
			'h_m.b.u-general': 'px',
			'h_m.l.u-general': 'px',
			'h_m.s': false,
			'h_p.t.u-general': 'px',
			'h_p_r.u-general': 'px',
			'h_p.b.u-general': 'px',
			'h_p.l.u-general': 'px',
			'h_p_sy-general': 'all',
			'h_p.s': false,
			'h-ti_ps-general': true,
			'h-ti_pc-general': 1,
			'h-ti_fs.u-general': 'px',
			'h-ti_fs-general': 30,
			'h-ti_lhe.u-general': 'px',
			'h-ti_ls.u-general': 'px',
			'h-ti_tin.u-general': 'px',
			'h-ti-t.s': false,
			'h-ti-t_c': 'Add your Hover Title here',
			'im-bo_ps-general': true,
			'im-bo_pc-general': 7,
			'im-bo_ps-general.h': true,
			'im-bo_pc-general.h': 4,
			'im-bo.sh': true,
			'im-bo.ra.sy-general': 'all',
			'im-bo.ra.u-general': 'px',
			'im-bo.ra.u-general.h': 'px',
			'im-bo_w.t-general': 3,
			'im-bo_w_r-general': 3,
			'im-bo_w.b-general': 3,
			'im-bo_w.l-general': 3,
			'im-bo_w.sy-general': 'all',
			'im-bo_w.u-general': 'px',
			'im-bs_ps-general': true,
			'im-bs_pc-general': 8,
			'im-bs_pc-general.h': 6,
			'im-bs.sh': false,
			im_sao: false,
			'im_mw.u-general': 'px',
			'im_w.u-general': 'px',
			'im_w-fit_c-general': false,
			'im_miw.u-general': 'px',
			'im_mh.u-general': 'px',
			'im_h.u-general': 'px',
			'im_mih.u-general': 'px',
			'im_p.t.u-general': 'px',
			'im_p_r.u-general': 'px',
			'im_p.b.u-general': 'px',
			'im_p.l.u-general': 'px',
			'im_p.sy-general': 'all',
			'bb.sh': false,
			'bo_ps-general': true,
			'bo_pc-general': 2,
			'bo_ps-general.h': true,
			'bo_pc-general.h': 6,
			'bo.sh': false,
			'bo.ra.sy-general': 'all',
			'bo.ra.u-general': 'px',
			'bo.ra.u-general.h': 'px',
			'bo_w.t-general': 2,
			'bo_w_r-general': 2,
			'bo_w.b-general': 2,
			'bo_w.l-general': 2,
			'bo_w.sy-general': 'all',
			'bo_w.u-general': 'px',
			'bs_ps-general': true,
			'bs_pc-general': 5,
			'bs_pc-general.h': 6,
			'bs.sh': false,
			_sao: false,
			'_mw.u-general': 'px',
			'_w.u-general': 'px',
			'_wfc-general': false,
			'_miw.u-general': 'px',
			'_mh.u-general': 'px',
			'_h.u-general': 'px',
			'_mih.u-general': 'px',
			'_m.sy-general': 'all',
			'_m.t.u-general': 'px',
			'_m_r.u-general': 'px',
			'_m.b.u-general': 'px',
			'_m.l.u-general': 'px',
			'_p.t.u-general': 'px',
			'_p_r.u-general': 'px',
			'_p.b.u-general': 'px',
			'_p.l.u-general': 'px',
			'_p.sy-general': 'all',
			shortcutEffect: 0,
			'scroll-vertical.s-general': false,
			'scroll-vertical-preview.s-general': false,
			'scroll-vertical-easing-general': 'ease',
			'scroll-vertical-speed-general': 500,
			'scroll-vertical-delay-general': 0,
			'scroll-vertical-viewport.t-general': 'mid',
			'scroll-vertical.s-reverse-general': true,
			'scroll-vertical-offset-start-general': -400,
			'scroll-vertical-offset-mid-general': 0,
			'scroll-vertical-offset-end-general': 400,
			'scroll-horizontal.s-general': false,
			'scroll-horizontal-preview.s-general': false,
			'scroll-horizontal-easing-general': 'ease',
			'scroll-horizontal-speed-general': 500,
			'scroll-horizontal-delay-general': 0,
			'scroll-horizontal-viewport.t-general': 'mid',
			'scroll-horizontal.s-reverse-general': true,
			'scroll-horizontal-offset-start-general': -200,
			'scroll-horizontal-offset-mid-general': 0,
			'scroll-horizontal-offset-end-general': 200,
			'scroll-rotate.s-general': false,
			'scroll-rotate-preview.s-general': false,
			'scroll-rotate-easing-general': 'ease',
			'scroll-rotate-speed-general': 500,
			'scroll-rotate-delay-general': 0,
			'scroll-rotate-viewport.t-general': 'mid',
			'scroll-rotate.s-reverse-general': true,
			'scroll-rotate-rotate-start-general': 90,
			'scroll-rotate-rotate-mid-general': 0,
			'scroll-rotate-rotate-end-general': 0,
			'scroll-scale.s-general': false,
			'scroll-scale-preview.s-general': false,
			'scroll-scale-easing-general': 'ease',
			'scroll-scale-speed-general': 500,
			'scroll-scale-delay-general': 0,
			'scroll-scale-viewport.t-general': 'mid',
			'scroll-scale.s-reverse-general': true,
			'scroll-scale-scale-start-general': 70,
			'scroll-scale-scale-mid-general': 100,
			'scroll-scale-scale-end-general': 100,
			'scroll-fade.s-general': false,
			'scroll-fade-preview.s-general': false,
			'scroll-fade-easing-general': 'ease',
			'scroll-fade-speed-general': 500,
			'scroll-fade-delay-general': 0,
			'scroll-fade-viewport.t-general': 'mid',
			'scroll-fade.s-reverse-general': true,
			'scroll-fade-opacity-start-general': 0,
			'scroll-fade-opacity-mid-general': 100,
			'scroll-fade-opacity-end-general': 100,
			'scroll-blur.s-general': false,
			'scroll-blur-preview.s-general': false,
			'scroll-blur-easing-general': 'ease',
			'scroll-blur-speed-general': 500,
			'scroll-blur-delay-general': 0,
			'scroll-blur-viewport.t-general': 'mid',
			'scroll-blur.s-reverse-general': true,
			'scroll-blur-blur-start-general': 10,
			'scroll-blur-blur-mid-general': 0,
			'scroll-blur-blur-end-general': 0,
			'tr-translate-x.u-general': '%',
			'tr-translate-y.u-general': '%',
			'tr-origin-x.u-general': '%',
			'tr-origin-y.u-general': '%',
			'_p.u-general': 'px',
			'_fb.u-general': 'px',
			'_rg.u-general': 'px',
			'_cg.u-general': 'px',
			_uid: 'image-maxi-331',
			_ioh: true,
			_bs: 'maxi-light',
			parentBlockStyle: 'light',
			_mi: 22,
			_mu: 'http://localhost:8888/wp_c/uploads/2022/04/ball.jpg',
			_mw: 225,
			_mh: 225,
			_mal: 'ball',
			'_ta-general': 'center',
			_se: '<svg viewBox="0 0 36.1 36.1" class="heart-54-shape-maxi-svg" data-item="image-maxi-331__svg"><pattern id="image-maxi-331__428__img" class="maxi-svg-block__pattern" width="100%" height="100%" x="0" y="0" patternunits="userSpaceOnUse"><image class="maxi-svg-block__pattern__image" width="100%" height="100%" x="0" y="0" href="http://localhost:8888/wp_c/uploads/2022/04/ball.jpg" preserveaspectratio="xMidYMid slice"></image></pattern><path fill="url(#image-maxi-331__428__img)" data-fill="" fill-rule="evenodd" d="M2.2 6.2h0c2.7-2.7 7.2-2.7 10 0L18 12l5.8-5.8c2.7-2.7 7.2-2.7 10 0h0c2.7 2.7 2.7 7.2 0 10L18 32 2.2 16.2c-2.7-2.8-2.7-7.3 0-10h0z" style="fill: url(#image-maxi-331__428__img)"></path></svg>',
			_sd: {
				'image-maxi-331__428': {
					color: '',
					imageID: 22,
					imageURL:
						'http://localhost:8888/wp_c/uploads/2022/04/ball.jpg',
				},
			},
			'im-bo_s-general': 'dashed',
			'im-bo.ra_tl-general': 71,
			'im-bo.ra_tr-general': 71,
			'im-bo.ra_br-general': 71,
			'im-bo.ra_bl-general': 71,
			'im-bo_s-general.h': 'dashed',
			'im-bo_w.t-general.h': 3,
			'im-bo_w.r-general.h': 3,
			'im-bo_w.b-general.h': 3,
			'im-bo_w.l-general.h': 3,
			'im-bo_w.sy-general.h': 'all',
			'im-bo_w.u-general.h': 'px',
			'im-bo.ra_tl-general.h': 71,
			'im-bo.ra_tr-general.h': 71,
			'im-bo.ra_br-general.h': 71,
			'im-bo.ra_bl-general.h': 71,
			'im-bo.ra.sy-general.h': 'all',
			'bs_po-general': 0.23,
			'bs_ho-general': 0,
			'bs_v-general': 30,
			'bs_blu-general': 50,
			'bs_sp-general': 0,
			'tr_sc-x-general': 65,
			'tr_sc-y-general': 110,
		};

		const result = getOrganizedAttributes(object, copyPasteMapping);
		expect(result).toMatchSnapshot();

		const result2 = getOrganizedAttributes(object, copyPasteMapping, true);
		expect(result2).toMatchSnapshot();
	});
});

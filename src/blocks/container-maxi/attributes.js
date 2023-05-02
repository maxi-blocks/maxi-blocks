/**
 * Imports
 */
import * as attributesData from '../../extensions/attributes/defaults/index';
import { transitionAttributesCreator } from '../../extensions/attributes/transitions';
import { customCss } from './data';

/**
 * Attributes
 */
const attributes = {
	...attributesData.global,

	/**
	 * Block styles
	 */
	...attributesData.arrow,
	...attributesData.shapeDivider,
	...{
		...attributesData.blockBackground,
		b_ly: {
			type: 'array',
			default: [
				{
					type: 'color',
					'd-general': 'block',
					'bc_ps-general': true,
					'bc_pc-general': 1,
					'bc_po-general': 1,
					'bc-general': '',
					'bc_cp-general': '',
					'bcw_pos.sy-general': 'all',
					'bcw_w-general': 100,
					'bcw_w.u-general': '%',
					'bcw_h-general': 100,
					'bcw_h.u-general': '%',
					'bcw_pos.b.u-general': 'px',
					'bcw_pos.t.u-general': 'px',
					'bcw_pos.l.u-general': 'px',
					'bcw_pos.r.u-general': 'px',
					order: 1,
					id: 1,
				},
			],
		},
	},
	...attributesData.border,
	...attributesData.borderWidth,
	...attributesData.borderRadius,
	...attributesData.borderHover,
	...attributesData.borderWidthHover,
	...attributesData.borderRadiusHover,
	...attributesData.boxShadow,
	...attributesData.boxShadowHover,
	...{
		...attributesData.size,
		'fw-general': {
			type: 'string',
			default: 'full',
		},
		sao: {
			type: 'boolean',
			default: true,
		},
	},
	...attributesData.margin,
	...{
		...attributesData.padding,
		'_p.t-general': {
			type: 'string',
			default: '20',
		},
		'_p.b-general': {
			type: 'string',
			default: '20',
		},
	},

	/**
	 * Advanced
	 */
	...attributesData.scroll,
	...attributesData.transform,
	...{
		...attributesData.transition,
		// TODO: bg layer from start
		...transitionAttributesCreator({ selectors: customCss.selectors }),
	},
	...attributesData.display,
	...attributesData.opacity,
	...attributesData.opacityHover,
	...attributesData.position,
	...attributesData.overflow,
	...attributesData.zIndex,
	...attributesData.customCss,
	...{
		...attributesData.flex,
		'_rg-general': {
			type: 'number',
			default: 20,
		},
		'_rg-unit-general': {
			type: 'string',
			default: 'px',
		},
		'_fd-general': {
			type: 'string',
			default: 'column',
		},
	},
};

export default attributes;

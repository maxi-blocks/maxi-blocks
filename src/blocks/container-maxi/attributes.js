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
					'd-g': 'block',
					'bc_ps-g': true,
					'bc_pc-g': 1,
					'bc_po-g': 1,
					'bc-g': '',
					'bc_cp-g': '',
					'bcw_pos.sy-g': 'all',
					'bcw_w-g': 100,
					'bcw_w.u-g': '%',
					'bcw_h-g': 100,
					'bcw_h.u-g': '%',
					'bcw_pos.b.u-g': 'px',
					'bcw_pos.t.u-g': 'px',
					'bcw_pos.l.u-g': 'px',
					'bcw_pos.r.u-g': 'px',
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
		'fw-g': {
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
		'_p.t-g': {
			type: 'string',
			default: '20',
		},
		'_p.b-g': {
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
		'_rg-g': {
			type: 'number',
			default: 20,
		},
		'_rg-unit-g': {
			type: 'string',
			default: 'px',
		},
		'_fd-g': {
			type: 'string',
			default: 'column',
		},
	},
};

export default attributes;

/**
 * Imports
 */
import { prefixAttributesCreator } from '../../extensions/attributes';
import * as attributesData from '../../extensions/attributes/defaults/index';
import { transitionAttributesCreator } from '../../extensions/attributes/transitions';
import { customCss, prefixes, transition } from './data';

const { buttonPrefix, closeIconPrefix, inputPrefix } = prefixes;
// without Hyphen
const buttonWO = buttonPrefix?.replace('-', '');
const closeWO = closeIconPrefix?.replace('-', '');
const inputWO = inputPrefix?.replace('-', '');

/**
 * Attributes
 */
const attributes = {
	...attributesData.global,

	/**
	 * Block styles
	 */
	...attributesData.border,
	...attributesData.borderHover,
	...attributesData.borderRadius,
	...attributesData.borderRadiusHover,
	...attributesData.borderWidth,
	...attributesData.borderWidthHover,
	...attributesData.boxShadow,
	...attributesData.boxShadowHover,
	...attributesData.margin,
	...attributesData.padding,
	...attributesData.size,

	/**
	 * Input styles
	 */
	skin: {
		type: 'string',
		default: 'boxed',
	},
	...prefixAttributesCreator({
		obj: {
			...attributesData.typography,
			...attributesData.typographyHover,
			...attributesData.border,
			...attributesData.borderHover,
			...attributesData.borderRadius,
			...attributesData.borderRadiusHover,
			...attributesData.borderWidth,
			...attributesData.padding,
			...attributesData.background,
			...attributesData.backgroundColor,
			...attributesData.backgroundHover,
			...attributesData.backgroundColorHover,
		},
		prefix: inputPrefix,
		diffValAttr: {
			[`${inputWO}_fs-general`]: '20',
			[`${inputPrefix}bo_s-general`]: 'solid',
			[`${inputPrefix}bo_w.t-general`]: 4,
			[`${inputPrefix}bo_w.r-general`]: 0,
			[`${inputPrefix}bo_w.b-general`]: 4,
			[`${inputPrefix}bo_w.l-general`]: 4,
			[`${inputPrefix}bo_w.sy-general`]: 'none',
			[`${inputWO}_p.t-general`]: '8',
			[`${inputWO}_p.r-general`]: '10',
			[`${inputWO}_p.b-general`]: '8',
			[`${inputWO}_p.l-general`]: '10',
			[`${inputWO}_p.sy-general`]: 'axis',
			[`${inputPrefix}b_am-general`]: 'color',
		},
	}),

	/**
	 * Button styles
	 */
	...attributesData.searchButton,
	...prefixAttributesCreator({
		obj: {
			...attributesData.typography,
			...attributesData.typographyHover,
			...attributesData.padding,
			...attributesData.margin,
			...attributesData.background,
			...attributesData.backgroundColor,
			...attributesData.backgroundHover,
			...attributesData.backgroundColorHover,
			...attributesData.border,
			...attributesData.borderHover,
			...attributesData.borderRadius,
			...attributesData.borderRadiusHover,
		},
		prefix: buttonPrefix,
		diffValAttr: {
			[`${buttonWO}_pc-general`]: 1,
			[`${buttonWO}_p.t-general`]: '12',
			[`${buttonWO}_p.r-general`]: '12',
			[`${buttonWO}_p.b-general`]: '12',
			[`${buttonWO}_p.l-general`]: '12',
			[`${buttonPrefix}b_am-general`]: 'color',
			[`${buttonPrefix}bc_pc-general`]: 4,
		},
	}),
	pla: {
		type: 'string',
		default: 'Search...',
	},
	...attributesData.placeholderColor,
	...{
		...attributesData.icon,
		_st: {
			type: 'string',
			default: 'Shape',
		},
		i_i: {
			type: 'boolean',
			default: false,
		},
		'i_w-general': {
			type: 'string',
			default: '25',
		},
		'i-f_pc': {
			type: 'number',
			default: 1,
		},
		'i_spa-general': {
			type: 'number',
			default: 0,
		},
		i_c: {
			type: 'string',
			default:
				'<svg viewBox="0 0 36.1 36.1" height="64px" width="64px" class="magnifying-glass-41-shape-maxi-svg"><path fill="#081219" d="M35.2 32.1l-7.9-7.9c1.9-2.6 3-5.7 3-8.9 0-8.3-6.8-15-15-15s-15 6.8-15 15 6.8 15 15 15c3.2 0 6.4-1 8.9-3l7.9 7.9c.4.4 1 .7 1.6.7s1.2-.2 1.6-.7.7-1 .7-1.6-.3-1.1-.8-1.5zm-19.9-6.2c-5.8 0-10.6-4.8-10.6-10.6S9.4 4.7 15.3 4.7s10.6 4.8 10.6 10.6-4.8 10.6-10.6 10.6z" data-fill></path></svg>',
		},
	},
	...attributesData.iconHover,
	...prefixAttributesCreator({
		obj: { ...attributesData.icon, ...attributesData.iconHover },
		prefix: closeIconPrefix,
		diffValAttr: {
			[`${closeWO}_st`]: 'Shape',
			[`${closeIconPrefix}i_i`]: false,
			[`${closeIconPrefix}i_w-general`]: '25',
			[`${closeIconPrefix}i-f_pc`]: 1,
			[`${closeIconPrefix}i_spa-general`]: 0,
			[`${closeIconPrefix}i_c`]:
				'<svg class="cross-29-shape-maxi-svg" width="64px" height="64px" viewBox="0 0 36.1 36.1" data-fill fill="#081219"><path d="M26.1 13l-3-3-5 5-5.1-5-3 3 5 5-5 5.1 3 3 5.1-5 5 5 3-3-5-5.1zm4.5-7.5c-6.9-6.9-18.2-6.9-25.1 0s-6.9 18.2 0 25.1 18.2 6.9 25.1 0 6.9-18.2 0-25.1zm-2.1 23c-5.8 5.8-15.2 5.8-20.9 0-5.8-5.8-5.8-15.2 0-20.9 5.8-5.8 15.2-5.8 20.9 0 5.8 5.8 5.8 15.1 0 20.9z"/></svg>',
		},
	}),

	/**
	 * Advanced
	 */
	...attributesData.scroll,
	...attributesData.transform,
	...{
		...attributesData.transition,
		...transitionAttributesCreator({
			transition,
			selectors: customCss.selectors,
		}),
	},
	...attributesData.display,
	...attributesData.opacity,
	...attributesData.opacityHover,
	...attributesData.position,
	...attributesData.overflow,
	...attributesData.zIndex,
	...attributesData.customCss,
	...attributesData.flex,
};

export default attributes;

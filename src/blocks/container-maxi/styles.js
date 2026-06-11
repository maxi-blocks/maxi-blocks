/**
 * Internal dependencies
 */
import { getGroupAttributes, styleProcessor } from '@extensions/styles';
import {
	getBorderStyles,
	getSizeStyles,
	getBoxShadowStyles,
	getOpacityStyles,
	getZIndexStyles,
	getPositionStyles,
	getDisplayStyles,
	getBlockBackgroundStyles,
	getArrowStyles,
	getMarginPaddingStyles,
	getShapeDividerStyles,
	getShapeDividerSVGStyles,
	getOverflowStyles,
	getFlexStyles,
	getPaginationStyles,
	getPaginationLinksStyles,
	getPaginationColours,
} from '@extensions/styles/helpers';
import data, { maxiAttributes as containerDefaults } from './data';

/**
 * Shipped container size defaults keyed by CSS property + breakpoint.
 * Built once from data.js maxiAttributes so per-block CSS can reference
 * SC variables instead of hard values when the attribute is unchanged.
 */
const sizeDefaultMap = {};
['max-width', 'width', 'height', 'min-height'].forEach(prop => {
	['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'].forEach(bp => {
		const key = `${prop}-${bp}`;
		if (key in containerDefaults) sizeDefaultMap[key] = containerDefaults[key];
	});
});

/**
 * Replace default size values with SC CSS variable references so that SC
 * container globals flow through the higher-specificity per-block CSS.
 * Custom (user-modified) values are left as-is.
 */
const applySCVarsToSize = (sizeObj, attrs, blockStyle) => {
	if (!blockStyle) return sizeObj;
	const result = {};

	Object.entries(sizeObj).forEach(([breakpoint, styles]) => {
		if (!styles || typeof styles !== 'object') {
			result[breakpoint] = styles;
			return;
		}
		const newStyles = {};
		Object.entries(styles).forEach(([cssProp, cssValue]) => {
			const attrKey = `${cssProp}-${breakpoint}`;
			if (
				attrKey in sizeDefaultMap &&
				String(attrs[attrKey]) === String(sizeDefaultMap[attrKey])
			) {
				newStyles[cssProp] =
					`var(--maxi-${blockStyle}-container-${cssProp}-${breakpoint}, ${cssValue})`;
			} else {
				newStyles[cssProp] = cssValue;
			}
		});
		result[breakpoint] = newStyles;
	});
	return result;
};

/**
 * Shipped container margin/padding defaults (currently none, but future-proof).
 */
const spacingDefaultMap = {};
['margin', 'padding'].forEach(type => {
	['top', 'right', 'bottom', 'left'].forEach(side => {
		['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'].forEach(bp => {
			const key = `${type}-${side}-${bp}`;
			if (key in containerDefaults) spacingDefaultMap[key] = containerDefaults[key];
		});
	});
});

const applySCVarsToSpacing = (spacingObj, attrs, blockStyle, type) => {
	if (!blockStyle) return spacingObj;
	const result = {};

	Object.entries(spacingObj).forEach(([breakpoint, styles]) => {
		if (!styles || typeof styles !== 'object') {
			result[breakpoint] = styles;
			return;
		}
		const newStyles = {};
		Object.entries(styles).forEach(([cssProp, cssValue]) => {
			const attrKey = `${cssProp}-${breakpoint}`;
			if (
				attrKey in spacingDefaultMap &&
				String(attrs[attrKey]) === String(spacingDefaultMap[attrKey])
			) {
				newStyles[cssProp] =
					`var(--maxi-${blockStyle}-container-${cssProp}-${breakpoint}, ${cssValue})`;
			} else {
				newStyles[cssProp] = cssValue;
			}
		});
		result[breakpoint] = newStyles;
	});
	return result;
};

const getNormalObject = props => {
	const sizeAttrs = getGroupAttributes(props, 'size');
	const rawSize = getSizeStyles(sizeAttrs);
	const marginAttrs = getGroupAttributes(props, 'margin');
	const paddingAttrs = getGroupAttributes(props, 'padding');

	const response = {
		border: getBorderStyles({
			obj: {
				...getGroupAttributes(props, [
					'border',
					'borderWidth',
					'borderRadius',
				]),
			},
			blockStyle: props.blockStyle,
		}),
		size: applySCVarsToSize(rawSize, sizeAttrs, props.blockStyle),
		boxShadow: getBoxShadowStyles({
			obj: {
				...getGroupAttributes(props, 'boxShadow'),
			},
			blockStyle: props.blockStyle,
		}),
		opacity: getOpacityStyles({
			...getGroupAttributes(props, 'opacity'),
		}),
		zIndex: getZIndexStyles({
			...getGroupAttributes(props, 'zIndex'),
		}),
		position: getPositionStyles({
			...getGroupAttributes(props, 'position'),
		}),
		display: getDisplayStyles({
			...getGroupAttributes(props, 'display'),
		}),
		overflow: getOverflowStyles({
			...getGroupAttributes(props, 'overflow'),
		}),
		margin: applySCVarsToSpacing(
			getMarginPaddingStyles({ obj: marginAttrs }),
			marginAttrs,
			props.blockStyle,
			'margin'
		),
		padding: applySCVarsToSpacing(
			getMarginPaddingStyles({ obj: paddingAttrs }),
			paddingAttrs,
			props.blockStyle,
			'padding'
		),
		flex: getFlexStyles({
			...getGroupAttributes(props, 'flex'),
		}),
	};

	return response;
};

const getHoverObject = props => {
	const response = {
		border:
			props['border-status-hover'] &&
			getBorderStyles({
				obj: {
					...getGroupAttributes(
						props,
						['border', 'borderWidth', 'borderRadius'],
						true
					),
				},
				isHover: true,
				blockStyle: props.blockStyle,
			}),
		boxShadow:
			props['box-shadow-status-hover'] &&
			getBoxShadowStyles({
				obj: {
					...getGroupAttributes(props, 'boxShadow', true),
				},
				isHover: true,
				blockStyle: props.blockStyle,
			}),
		opacity:
			props['opacity-status-hover'] &&
			getOpacityStyles(
				{ ...getGroupAttributes(props, 'opacity', true) },
				true
			),
	};

	return response;
};

const getStyles = props => {
	const { uniqueID } = props;

	const response = {
		[uniqueID]: styleProcessor(
			{
				'': getNormalObject(props),
				':hover': getHoverObject(props),
				...(props['shape-divider-top-status'] && {
					' .maxi-shape-divider__top': {
						shapeDivider: {
							...getShapeDividerStyles(
								{
									...getGroupAttributes(props, [
										'shapeDivider',
										'padding',
									]),
								},
								'top'
							),
						},
					},
					' .maxi-shape-divider__top svg': {
						shapeDivider: {
							...getShapeDividerSVGStyles(
								{
									...getGroupAttributes(props, [
										'shapeDivider',
										'padding',
									]),
								},
								'top',
								props.blockStyle
							),
						},
					},
				}),
				...(props['shape-divider-bottom-status'] && {
					' .maxi-shape-divider__bottom': {
						shapeDivider: {
							...getShapeDividerStyles(
								{
									...getGroupAttributes(props, [
										'shapeDivider',
										'padding',
									]),
								},
								'bottom'
							),
						},
					},
					' .maxi-shape-divider__bottom svg': {
						shapeDivider: {
							...getShapeDividerSVGStyles(
								{
									...getGroupAttributes(props, [
										'shapeDivider',
										'padding',
									]),
								},
								'bottom',
								props.blockStyle
							),
						},
					},
				}),
				...getBlockBackgroundStyles({
					...getGroupAttributes(props, [
						'blockBackground',
						'border',
						'borderWidth',
						'borderRadius',
					]),
					blockStyle: props.blockStyle,
				}),
				...getBlockBackgroundStyles({
					...getGroupAttributes(
						props,
						[
							'blockBackground',
							'border',
							'borderWidth',
							'borderRadius',
						],
						true
					),
					isHover: true,
					blockStyle: props.blockStyle,
				}),
				...getArrowStyles({
					...getGroupAttributes(props, [
						'arrow',
						'border',
						'borderWidth',
						'borderRadius',
						'blockBackground',
						'boxShadow',
					]),
					blockStyle: props.blockStyle,
					transition: props.transition,
				}),
				...getArrowStyles({
					...getGroupAttributes(
						props,
						[
							'arrow',
							'border',
							'borderWidth',
							'borderRadius',
							'blockBackground',
							'boxShadow',
						],
						true
					),
					...getGroupAttributes(props, ['arrow']),
					blockStyle: props.blockStyle,
					isHover: true,
					transition: props.transition,
				}),
				...(props['cl-pagination'] && {
					' .maxi-pagination': getPaginationStyles(props),
					' .maxi-pagination a': getPaginationLinksStyles(props),
					' .maxi-pagination .maxi-pagination__pages > span':
						getPaginationLinksStyles(props),
					' .maxi-pagination a:hover': getPaginationColours(
						props,
						'hover'
					),
					' .maxi-pagination .maxi-pagination__pages > span.maxi-pagination__link--current':
						getPaginationColours(props, 'current'),
				}),
			},
			data,
			props
		),
	};

	return response;
};

export default getStyles;

/**
 * Internal dependencies
 */
import {
	getColorRGBAString,
	getGroupAttributes,
	getLastBreakpointAttribute,
	getPaletteAttributes,
	styleProcessor,
} from '../../extensions/styles';
import {
	getBoxShadowStyles,
	getZIndexStyles,
	getDisplayStyles,
	getMarginPaddingStyles,
	getBorderStyles,
	getOpacityStyles,
	getOverflowStyles,
	getFlexStyles,
	getSizeStyles,
	getTypographyStyles,
} from '../../extensions/styles/helpers';
import { selectorsNavigationMenu } from './custom-css';

const getNormalObject = props => {
	const response = {
		boxShadow: getBoxShadowStyles({
			obj: {
				...getGroupAttributes(props, 'boxShadow'),
			},
			blockStyle: props.blockStyle,
		}),
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
		padding: getMarginPaddingStyles({
			obj: { ...getGroupAttributes(props, 'padding') },
		}),
		margin: getMarginPaddingStyles({
			obj: { ...getGroupAttributes(props, 'margin') },
		}),
		opacity: getOpacityStyles({
			...getGroupAttributes(props, 'opacity'),
		}),
		zIndex: getZIndexStyles({
			...getGroupAttributes(props, 'zIndex'),
		}),
		display: getDisplayStyles({
			...getGroupAttributes(props, 'display'),
		}),
		size: getSizeStyles({
			...getGroupAttributes(props, 'size'),
		}),
		overflow: getOverflowStyles({
			...getGroupAttributes(props, 'overflow'),
		}),
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
	};

	return response;
};

const getEffectStyles = (props, target, isHover = false, prefix = '') => {
	const { 'effect-type': effectType } = props;

	const getColor = () => {
		const { paletteStatus, paletteColor, paletteOpacity, color } =
			getPaletteAttributes({
				obj: props,
				prefix: `${prefix}effect-`,
				isHover,
			});

		if (paletteStatus)
			return getColorRGBAString({
				firstVar: `${prefix}effect-color`,
				secondVar: `color-${paletteColor}`,
				opacity: paletteOpacity,
				blockStyle: props.blockStyle,
			});

		return color;
	};

	const effectThickness = `${getLastBreakpointAttribute({
		target: `${prefix}effect-thickness`,
		breakpoint: 'general',
		attributes: props,
		isHover,
	})}${
		getLastBreakpointAttribute({
			target: `${prefix}effect-thickness-unit`,
			breakpoint: 'general',
			attributes: props,
			isHover,
		}) ?? 'px'
	}`;
	const effectWidth = `${getLastBreakpointAttribute({
		target: `${prefix}effect-width`,
		breakpoint: 'general',
		attributes: props,
		isHover,
	})}${
		getLastBreakpointAttribute({
			target: `${prefix}effect-width-unit`,
			breakpoint: 'general',
			attributes: props,
			isHover,
		}) ?? '%'
	}`;

	switch (effectType) {
		case 'solidBackground':
			return {
				[`${target}::after`]: {
					effect: {
						general: {
							top: 0,
							bottom: 0,
							left: 0,
							right: 0,
							'background-color': getColor(),
						},
					},
				},
			};
		case 'underline':
			return {
				[`${target}::after`]: {
					effect: {
						general: {
							bottom: 0,
							left: 0,
							height: effectThickness,
							width: effectWidth,
							'background-color': getColor(),
						},
					},
				},
			};
		case 'overline':
			return {
				[`${target}::before`]: {
					effect: {
						general: {
							top: 0,
							left: 0,
							height: effectThickness,
							width: effectWidth,
							'background-color': getColor(),
						},
					},
				},
			};
		case 'doubleLine':
			return {
				[`${target}::before`]: {
					effect: {
						general: {
							top: 0,
							left: 0,
							height: effectThickness,
							width: effectWidth,
							'background-color': getColor(),
						},
					},
				},
				[`${target}::after`]: {
					effect: {
						general: {
							bottom: 0,
							left: 0,
							height: effectThickness,
							width: effectWidth,
							'background-color': getColor(),
						},
					},
				},
			};
		case 'boxed':
			return {
				[`${target}::after`]: {
					effect: {
						general: {
							top: 0,
							bottom: 0,
							left: 0,
							right: 0,
							background: 'transparent',
							'border-width': effectThickness,
							'border-color': getColor(),
							'border-style': 'solid',
						},
					},
				},
			};
		case 'boldText':
			return {
				[`${target}`]: {
					effect: {
						general: {
							'font-weight': 'bold',
						},
					},
				},
			};
		default:
			return null;
	}
};

const getMenuItemObject = props => {
	const prefix = 'menu-item-';

	const itemSelectors = [
		'.maxi-navigation-link-block',
		'.maxi-navigation-submenu-block',
	];

	const response = itemSelectors.reduce((acc, selector) => {
		return {
			...acc,
			[` ${selector} ${selector}__content`]: {
				typography: getTypographyStyles({
					obj: getGroupAttributes(props, 'menuItem'),
					prefix,
					blockStyle: props.blockStyle,
					textLevel: 'p',
				}),
			},
			[` ${selector} ${selector}__content:hover`]: {
				typography: getTypographyStyles({
					obj: getGroupAttributes(props, 'menuItem', true),
					prefix,
					blockStyle: props.blockStyle,
					textLevel: 'p',
					isHover: true,
					normalTypography: {
						...getGroupAttributes(props, 'menuItem'),
					},
				}),
			},
			[` ${selector} ${selector}__content:active`]: {
				typography: getTypographyStyles({
					obj: getGroupAttributes(props, 'menuItem'),
					prefix: `active-${prefix}`,
					blockStyle: props.blockStyle,
					textLevel: 'p',
				}),
			},
			...getEffectStyles(props, ` ${selector} ${selector}__content`),
		};
	}, {});

	return response;
};

const getStyles = props => {
	const { uniqueID } = props;

	const response = {
		[uniqueID]: styleProcessor(
			{
				'': getNormalObject(props),
				':hover': getHoverObject(props),
				...getMenuItemObject(props),
			},
			selectorsNavigationMenu,
			props
		),
	};

	return response;
};

export default getStyles;

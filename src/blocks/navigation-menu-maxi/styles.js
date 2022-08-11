/**
 * Internal dependencies
 */
import {
	getColorRGBAString,
	getGroupAttributes,
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

const getMenuItemEffectObject = (props, isHover = false, prefix = '') => {
	const { 'effect-type': effectType } = props;

	const effectTypetoStylesMapping = {
		underline: {
			'border-width': '0 0 1px 0',
		},
		overline: {
			'border-width': '1px 0 0 0',
		},
		doubleLine: {
			'border-width': '1px 0',
		},
		boxed: {
			'border-width': '1px',
		},
	};

	const getEffectTypeStyles = () => {
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

		return {
			...(effectType === 'solidBackground'
				? {
						'background-color': getColor(),
				  }
				: {
						'border-color': getColor(),
						'border-style': 'solid',
				  }),
			...effectTypetoStylesMapping[effectType],
		};
	};

	const response = {
		' .maxi-navigation-link-block .maxi-navigation-link-block__content::after':
			{
				effect: {
					general: {
						...getEffectTypeStyles(),
					},
				},
			},
	};

	return response;
};

const getMenuItemObject = props => {
	const prefix = 'menu-item-';

	const response = {
		' .maxi-navigation-link-block .maxi-navigation-link-block__content': {
			typography: getTypographyStyles({
				obj: getGroupAttributes(props, 'menuItem'),
				prefix,
				blockStyle: props.blockStyle,
				textLevel: 'a',
			}),
		},
		' .maxi-navigation-link-block .maxi-navigation-link-block__content:hover':
			{
				typography: getTypographyStyles({
					obj: getGroupAttributes(props, 'menuItem', true),
					prefix,
					blockStyle: props.blockStyle,
					textLevel: 'a',
					isHover: true,
					normalTypography: {
						...getGroupAttributes(props, 'menuItem'),
					},
				}),
			},
		' .maxi-navigation-link-block .maxi-navigation-link-block__content:active':
			{
				typography: getTypographyStyles({
					obj: getGroupAttributes(props, 'menuItem'),
					prefix: `active-${prefix}`,
					blockStyle: props.blockStyle,
					textLevel: 'a',
				}),
			},
		...getMenuItemEffectObject(props),
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
				...getMenuItemObject(props),
			},
			selectorsNavigationMenu,
			props
		),
	};

	return response;
};

export default getStyles;

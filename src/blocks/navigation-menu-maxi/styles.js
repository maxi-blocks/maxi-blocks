/**
 * Internal dependencies
 */
import { getGroupAttributes, styleProcessor } from '../../extensions/styles';
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

const getMenuItemObject = props => {
	const prefix = 'menu-item-';

	const response = {
		' .maxi-navigation-link-block .maxi-navigation-link-block__content': {
			typogrpahy: getTypographyStyles({
				obj: getGroupAttributes(props, 'menuItem'),
				prefix,
				blockStyle: props.blockStyle,
				textLevel: 'a',
			}),
		},
		' .maxi-navigation-link-block .maxi-navigation-link-block__content:hover':
			{
				typogrpahy: getTypographyStyles({
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
				typogrpahy: getTypographyStyles({
					obj: getGroupAttributes(props, 'menuItem'),
					prefix: `active-${prefix}`,
					blockStyle: props.blockStyle,
					textLevel: 'a',
				}),
			},
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

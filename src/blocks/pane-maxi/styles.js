/**
 * Internal dependencies
 */
import { getGroupAttributes, styleProcessor } from '../../extensions/styles';
import {
	getBackgroundStyles,
	getBlockBackgroundStyles,
	getBorderStyles,
	getBoxShadowStyles,
	getDisplayStyles,
	getFlexStyles,
	getMarginPaddingStyles,
	getOpacityStyles,
	getOverflowStyles,
	getPositionStyles,
	getSizeStyles,
	getZIndexStyles,
} from '../../extensions/styles/helpers';
import data from './data';

const getNormalObject = props => {
	const response = {
		border: getBorderStyles({
			obj: {
				...getGroupAttributes(props, [
					'border',
					'borderWidth',
					'borderRadius',
					'borderHover',
				]),
			},
			blockStyle: props.blockStyle,
			uniqueID: props.uniqueID,
		}),
		size: getSizeStyles({
			...getGroupAttributes(props, 'size'),
		}),
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
		margin: getMarginPaddingStyles({
			obj: {
				...getGroupAttributes(props, 'margin'),
			},
		}),
		padding: getMarginPaddingStyles({
			obj: {
				...getGroupAttributes(props, 'padding'),
			},
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

const getNormalStyles = (props, prefix) => {
	const response = {
		...getBackgroundStyles({
			...getGroupAttributes(
				props,
				['background', 'backgroundColor', 'backgroundGradient'],
				false,
				prefix
			),
			blockStyle: props.blockStyle,
			prefix,
		}),
		border: getBorderStyles({
			obj: {
				...getGroupAttributes(
					props,
					['border', 'borderWidth', 'borderRadius', 'borderHover'],
					false,
					prefix
				),
			},
			blockStyle: props.blockStyle,
			uniqueID: props.uniqueID,
			prefix,
		}),
		size: getSizeStyles({
			...getGroupAttributes(props, 'size', false, prefix),
			prefix,
		}),
		boxShadow: getBoxShadowStyles({
			obj: {
				...getGroupAttributes(props, 'boxShadow', false, prefix),
			},
			blockStyle: props.blockStyle,
			prefix,
		}),
		padding: getMarginPaddingStyles({
			obj: {
				...getGroupAttributes(props, 'padding', false, prefix),
			},
			prefix,
		}),
	};

	return response;
};

const getHoverStyles = (props, prefix) => {
	const response = {
		...(props[`${prefix}background-status-hover`] &&
			getBackgroundStyles({
				...getGroupAttributes(
					props,
					['background', 'backgroundColor', 'backgroundGradient'],
					true,
					prefix
				),
				blockStyle: props.blockStyle,
				prefix,
				isHover: true,
			})),
		border:
			props[`${prefix}border-status-hover`] &&
			getBorderStyles({
				obj: {
					...getGroupAttributes(
						props,
						['border', 'borderWidth', 'borderRadius'],
						true,
						prefix
					),
				},
				blockStyle: props.blockStyle,
				prefix,
				isHover: true,
			}),
		boxShadow:
			props[`${prefix}box-shadow-status-hover`] &&
			getBoxShadowStyles({
				obj: {
					...getGroupAttributes(props, 'boxShadow', true, prefix),
				},
				blockStyle: props.blockStyle,
				prefix,
				isHover: true,
			}),
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
				' .maxi-pane-block__header': getNormalStyles(props, 'header-'),
				' .maxi-pane-block__content': getNormalStyles(
					props,
					'content-'
				),
				' .maxi-pane-block__header:hover': getHoverStyles(
					props,
					'header-'
				),
				' .maxi-pane-block__content:hover': getHoverStyles(
					props,
					'content-'
				),
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
			},
			data,
			props
		),
	};
	return response;
};

export default getStyles;

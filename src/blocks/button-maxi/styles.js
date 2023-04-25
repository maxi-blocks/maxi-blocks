/**
 * Internal dependencies
 */
import {
	getAttributesValue,
	getGroupAttributes,
} from '../../extensions/attributes';
import { styleProcessor } from '../../extensions/styles';
import {
	getAlignmentFlexStyles,
	getAlignmentTextStyles,
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
	getTypographyStyles,
	getZIndexStyles,
	getButtonIconStyles,
} from '../../extensions/styles/helpers';
import data from './data';

const prefix = 'bt-';

const getWrapperObject = props => {
	const response = {
		alignment: getAlignmentFlexStyles({
			...getGroupAttributes(props, 'alignment'),
		}),
		border: getBorderStyles({
			obj: {
				...getGroupAttributes(props, [
					'border',
					'borderWidth',
					'borderRadius',
				]),
			},
			blockStyle: props._bs,
			isButton: true,
		}),
		boxShadow: getBoxShadowStyles({
			obj: {
				...getGroupAttributes(props, 'boxShadow'),
			},
			blockStyle: props._bs,
		}),
		opacity: getOpacityStyles({
			...getGroupAttributes(props, 'opacity'),
		}),
		size: getSizeStyles({
			...getGroupAttributes(props, 'size'),
		}),
		flex: getFlexStyles({
			...getGroupAttributes(props, 'flex'),
		}),
		margin: getMarginPaddingStyles({
			obj: {
				...getGroupAttributes(props, 'margin'),
			},
			prefix,
		}),
		padding: getMarginPaddingStyles({
			obj: {
				...getGroupAttributes(props, 'padding'),
			},
			prefix,
		}),
		display: getDisplayStyles({
			...getGroupAttributes(props, 'display'),
		}),
		position: getPositionStyles({
			...getGroupAttributes(props, 'position'),
		}),
		overflow: getOverflowStyles({
			...getGroupAttributes(props, 'overflow'),
		}),
		zIndex: getZIndexStyles({
			...getGroupAttributes(props, 'zIndex'),
		}),
	};

	return response;
};

const getHoverWrapperObject = props => {
	const [boxShadowStatusHover, opacityStatusHover] = getAttributesValue({
		target: ['box-shadow-status', '_o.s'],
		props,
		isHover: true,
	});

	const response = {
		border: getBorderStyles({
			obj: {
				...getGroupAttributes(
					props,
					['border', 'borderWidth', 'borderRadius'],
					true
				),
			},
			blockStyle: props._bs,
			isHover: true,
			isButton: false, // yes, is button, but in this case is the wrapper 👍
		}),
		boxShadow:
			boxShadowStatusHover &&
			getBoxShadowStyles({
				obj: {
					...getGroupAttributes(props, 'boxShadow', true),
				},
				blockStyle: props._bs,
				isHover: true,
			}),
		opacity:
			opacityStatusHover &&
			getOpacityStyles(
				{ ...getGroupAttributes(props, 'opacity', true) },
				true
			),
	};

	return response;
};

const getNormalObject = props => {
	const response = {
		size: getSizeStyles(
			{
				...getGroupAttributes(props, 'size', false, 'bt-'),
			},
			'bt-'
		),
		border: getBorderStyles({
			obj: {
				...getGroupAttributes(
					props,
					['border', 'borderWidth', 'borderRadius'],
					false,
					'bt-'
				),
			},
			blockStyle: props._bs,
			isButton: true,
			prefix: 'bt-',
			scValues: props.scValues,
		}),
		boxShadow: getBoxShadowStyles({
			obj: {
				...getGroupAttributes(props, 'boxShadow', false, 'bt-'),
			},
			blockStyle: props._bs,
			prefix: 'bt-',
		}),
		textAlignment: getAlignmentTextStyles({
			...getGroupAttributes(props, 'textAlignment'),
		}),
		...getBackgroundStyles({
			...getGroupAttributes(
				props,
				['background', 'backgroundColor', 'backgroundGradient'],
				false,
				'bt-'
			),
			isButton: true,
			blockStyle: props._bs,
			prefix: 'bt-',
		}),
		margin: getMarginPaddingStyles({
			obj: {
				...getGroupAttributes(props, 'margin', false, 'bt-'),
			},
			prefix: 'bt-',
		}),
		padding: getMarginPaddingStyles({
			obj: {
				...getGroupAttributes(props, 'padding', false, 'bt-'),
			},
			prefix: 'bt-',
		}),
	};

	return response;
};

const getHoverObject = (props, scValues) => {
	const buttonBoxShadowStatusHover = getAttributesValue({
		target: 'bs.sh',
		props,
		isHover: true,
		prefix: 'bt-',
	});

	const response = {
		border: getBorderStyles({
			obj: {
				...getGroupAttributes(
					props,
					['border', 'borderWidth', 'borderRadius'],
					true,
					'bt-'
				),
			},
			isHover: true,
			blockStyle: props._bs,
			isButton: true,
			prefix: 'bt-',
			scValues,
		}),
		boxShadow:
			buttonBoxShadowStatusHover &&
			getBoxShadowStyles({
				obj: {
					...getGroupAttributes(props, 'boxShadow', true, 'bt-'),
				},
				isHover: true,
				prefix: 'bt-',
				blockStyle: props._bs,
			}),
		...getBackgroundStyles({
			...getGroupAttributes(
				props,
				['background', 'backgroundColor', 'backgroundGradient'],
				true,
				'bt-'
			),
			isButton: true,
			blockStyle: props._bs,
			isHover: true,
			prefix: 'bt-',
			scValues,
		}),
	};

	return response;
};

const getContentObject = props => {
	const response = {
		typography: getTypographyStyles({
			obj: {
				...getGroupAttributes(props, 'typography'),
			},
			blockStyle: props._bs,
			textLevel: 'button',
		}),
	};

	return response;
};

const getHoverContentObject = (props, scValues) => {
	const response = {
		typography: getTypographyStyles({
			obj: {
				...getGroupAttributes(props, 'typography', true),
			},
			isHover: true,
			blockStyle: props._bs,
			textLevel: 'button',
			normalTypography: {
				...getGroupAttributes(props, 'typography'),
			},
			scValues,
		}),
	};

	return response;
};

const getStyles = (props, scValues, iconWidthHeightRatio) => {
	const { _uid: uniqueID, _bs: blockStyle } = props;

	const response = {
		[uniqueID]: styleProcessor(
			{
				'': getWrapperObject(props),
				':hover': getHoverWrapperObject(props),
				' .maxi-button-block__button': getNormalObject(props),
				' .maxi-button-block__content': getContentObject(props),
				...getBlockBackgroundStyles({
					...getGroupAttributes(props, [
						'blockBackground',
						'border',
						'borderWidth',
						'borderRadius',
					]),
					blockStyle,
				}),
				...getButtonIconStyles({
					obj: props,
					blockStyle,
					target: '.maxi-button-block__icon',
					wrapperTarget: '.maxi-button-block__button',
					iconWidthHeightRatio,
				}),
				// Hover
				' .maxi-button-block__button:hover': getHoverObject(
					props,
					scValues
				),
				' .maxi-button-block__button:hover .maxi-button-block__content':
					getHoverContentObject(props, scValues),
				...getBlockBackgroundStyles({
					...getGroupAttributes(props, [
						'blockBackground',
						'border',
						'borderWidth',
						'borderRadius',
					]),
					blockStyle,
					isHover: true,
				}),
				...getButtonIconStyles({
					obj: props,
					blockStyle,
					isHover: true,
					target: '.maxi-button-block__icon',
					wrapperTarget: '.maxi-button-block__button',
					iconWidthHeightRatio,
				}),
			},
			data,
			props
		),
	};

	return response;
};

export default getStyles;

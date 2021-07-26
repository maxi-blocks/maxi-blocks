import { getGroupAttributes } from '../../extensions/styles';
import {
	getBorderStyles,
	getSizeStyles,
	getBoxShadowStyles,
	getOpacityStyles,
	getZIndexStyles,
	getPositionStyles,
	getDisplayStyles,
	getTransformStyles,
	getBackgroundStyles,
	getMarginPaddingStyles,
	getTypographyStyles,
	getCustomFormatsStyles,
	getAlignmentTextStyles,
	getLinkStyles,
} from '../../extensions/styles/helpers';

const getNormalObject = props => {
	const response = {
		border: getBorderStyles({
			obj: {
				...getGroupAttributes(props, [
					'border',
					'borderWidth',
					'borderRadius',
				]),
			},
			parentBlockStyle: props.parentBlockStyle,
		}),
		size: getSizeStyles({
			...getGroupAttributes(props, 'size'),
		}),
		boxShadow: getBoxShadowStyles({
			obj: {
				...getGroupAttributes(props, 'boxShadow'),
			},
			parentBlockStyle: props.parentBlockStyle,
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
		transform: getTransformStyles({
			...getGroupAttributes(props, 'transform'),
		}),
		margin: getMarginPaddingStyles({
			...getGroupAttributes(props, 'margin'),
		}),
		padding: getMarginPaddingStyles({
			...getGroupAttributes(props, 'padding'),
		}),
		textAlignment: getAlignmentTextStyles({
			...getGroupAttributes(props, 'textAlignment'),
		}),
	};

	return response;
};

const getHoverObject = props => {
	const response = {
		border:
			props['border-status-hover'] &&
			props['border-style-general-hover'] &&
			props['border-style-general-hover'] !== 'none' &&
			getBorderStyles({
				obj: {
					...getGroupAttributes(
						props,
						['border', 'borderWidth', 'borderRadius'],
						true
					),
				},
				isHover: true,
				parentBlockStyle: props.parentBlockStyle,
			}),
		boxShadow:
			props['box-shadow-status-hover'] &&
			getBoxShadowStyles({
				obj: {
					...getGroupAttributes(props, 'boxShadow', true),
				},
				isHover: true,
				parentBlockStyle: props.parentBlockStyle,
			}),
	};

	return response;
};

const getTypographyObject = (props, isList = false) => {
	const response = {
		typography: getTypographyStyles({
			obj: {
				...getGroupAttributes(props, 'typography'),
			},
			parentBlockStyle: props.parentBlockStyle,
			textLevel: props.textLevel,
		}),
		...(isList && {
			listAlignment: getAlignmentTextStyles(
				{
					...getGroupAttributes(props, 'textAlignment'),
				},
				'list'
			),
		}),
	};

	return response;
};

const getTypographyHoverObject = props => {
	const response = {
		typography: getTypographyStyles({
			obj: {
				...getGroupAttributes(props, 'typographyHover'),
			},
			isHover: true,
			parentBlockStyle: props.parentBlockStyle,
			textLevel: props.textLevel,
			normalTypography: {
				...getGroupAttributes(props, 'typography'),
			},
		}),
	};

	return response;
};

const getStyles = props => {
	const { uniqueID, isList, textLevel, typeOfList } = props;
	const element = isList ? typeOfList : textLevel;

	return {
		[uniqueID]: {
			'': getNormalObject(props),
			':hover': getHoverObject(props),
			...(!isList && {
				[` ${element}.maxi-text-block__content`]: getTypographyObject(
					props,
					isList
				),
				[` ${element}.maxi-text-block__content:hover`]:
					getTypographyHoverObject(props),
			}),
			...(isList && {
				[` ${element}.maxi-text-block__content li`]:
					getTypographyObject(props),
				[` ${element}.maxi-text-block__content li:hover`]:
					getTypographyHoverObject(props),
			}),
			...getBackgroundStyles({
				...getGroupAttributes(props, [
					'background',
					'backgroundColor',
					'backgroundImage',
					'backgroundVideo',
					'backgroundGradient',
					'backgroundSVG',
					'border',
					'borderWidth',
					'borderRadius',
				]),
				blockStyle: props.parentBlockStyle,
			}),
			...getBackgroundStyles({
				...getGroupAttributes(props, [
					'backgroundHover',
					'backgroundColorHover',
					'backgroundGradientHover',
					'borderHover',
					'borderRadiusHover',
					'borderWidthHover',
				]),
				isHover: true,
				blockStyle: props.parentBlockStyle,
			}),
			...getCustomFormatsStyles(
				!isList
					? ' .maxi-text-block__content'
					: ' .maxi-text-block__content li',
				props['custom-formats'],
				false,
				{ ...getGroupAttributes(props, 'typography') },
				props.textLevel,
				props.parentBlockStyle
			),
			...getCustomFormatsStyles(
				!isList
					? ':hover .maxi-text-block__content'
					: ':hover .maxi-text-block__content li',
				props['custom-formats-hover'],
				true,
				getGroupAttributes(props, ['typography', 'typographyHover']),
				props.textLevel,
				props.parentBlockStyle
			),
			...getLinkStyles(
				{ ...getGroupAttributes(props, 'link') },
				[` a ${element}.maxi-text-block__content`],
				props.parentBlockStyle
			),
			...getLinkStyles(
				{ ...getGroupAttributes(props, 'link') },
				[` ${element}.maxi-text-block__content a`],
				props.parentBlockStyle
			),
		},
	};
};

export default getStyles;

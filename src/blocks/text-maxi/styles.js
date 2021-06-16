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
} from '../../extensions/styles/helpers';

const getNormalObject = props => {
	const response = {
		border: getBorderStyles({
			...getGroupAttributes(props, [
				'border',
				'borderWidth',
				'borderRadius',
			]),
		}),
		size: getSizeStyles({
			...getGroupAttributes(props, 'size'),
		}),
		boxShadow: getBoxShadowStyles(
			{
				...getGroupAttributes(props, 'boxShadow'),
			},
			false,
			props['arrow-status']
		),
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
			getBorderStyles(
				{
					...getGroupAttributes(
						props,
						['border', 'borderWidth', 'borderRadius'],
						true
					),
				},
				true
			),
		boxShadow:
			props['box-shadow-status-hover'] &&
			getBoxShadowStyles(
				{
					...getGroupAttributes(props, 'boxShadow', true),
				},
				true,
				props['arrow-status']
			),
	};

	return response;
};

const getTypographyObject = (props, isList = false) => {
	const response = {
		typography: getTypographyStyles({
			...getGroupAttributes(props, 'typography'),
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
		typography: getTypographyStyles(
			{
				...getGroupAttributes(props, 'typographyHover'),
			},
			true
		),
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
			[` ${element}.maxi-text-block__content a`]:
				getTypographyObject(props),
			[` ${element}.maxi-text-block__content a:hover`]:
				getTypographyHoverObject(props),
			...getBackgroundStyles({
				...getGroupAttributes(props, [
					'background',
					'backgroundColor',
					'backgroundImage',
					'backgroundVideo',
					'backgroundGradient',
					'backgroundSVG',
					'borderRadius',
				]),
			}),
			...getBackgroundStyles({
				...getGroupAttributes(props, [
					'backgroundHover',
					'backgroundColorHover',
					'backgroundGradientHover',
					'borderRadiusHover',
				]),
				isHover: true,
			}),
			...getCustomFormatsStyles(
				!isList
					? ' .maxi-text-block__content'
					: ' .maxi-text-block__content li',
				props['custom-formats'],
				false,
				{ ...getGroupAttributes(props, 'typography') }
			),
			...getCustomFormatsStyles(
				!isList
					? ':hover .maxi-text-block__content'
					: ':hover .maxi-text-block__content li',
				props['custom-formats-hover'],
				true,
				getGroupAttributes(props, 'typographyHover')
			),
		},
	};
};

export default getStyles;

import { getGroupAttributes } from '../../extensions/styles';
import {
	getAlignmentTextStyles,
	getBackgroundStyles,
	getBorderStyles,
	getBoxShadowStyles,
	getCustomFormatsStyles,
	getDisplayStyles,
	getMarginPaddingStyles,
	getOpacityStyles,
	getPositionStyles,
	getSizeStyles,
	getTransformStyles,
	getTypographyLinkStyles,
	getTypographyStyles,
	getZIndexStyles,
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

const getTypographyObject = props => {
	const response = {
		typography: getTypographyStyles({
			...getGroupAttributes(props, 'typography'),
		}),
	};

	return response;
};

const getTypographyLinkObject = (props, linkType) => {
	const response = {
		typography: {
			general: getTypographyLinkStyles(
				{
					...getGroupAttributes(props, 'linkColor'),
				},
				linkType
			),
		},
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
	const { uniqueID, isList } = props;

	let response = {
		[uniqueID]: getNormalObject(props),
		[`${uniqueID}:hover`]: getHoverObject(props),
		[`${uniqueID} .maxi-text-block__content`]: getTypographyObject(props),
		[`${uniqueID} .maxi-text-block__content:hover`]: getTypographyHoverObject(
			props
		),
		[`${uniqueID} .maxi-text-block__content li`]: getTypographyObject(
			props
		),
		[`${uniqueID} .maxi-text-block__content li:hover`]: getTypographyHoverObject(
			props
		),
		[`${uniqueID} .maxi-text-block__content a`]: getTypographyLinkObject(
			props,
			'link'
		),
		[`${uniqueID} .maxi-text-block__content a:hover`]: getTypographyLinkObject(
			props,
			'hover'
		),
		[`${uniqueID} .maxi-text-block__content a:active`]: getTypographyLinkObject(
			props,
			'active'
		),
		[`${uniqueID} .maxi-text-block__content a:visited`]: getTypographyLinkObject(
			props,
			'visited'
		),
	};

	response = {
		...response,
		...getBackgroundStyles({
			target: uniqueID,
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
			target: uniqueID,
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
				? `${uniqueID} .maxi-text-block__content`
				: `${uniqueID} .maxi-text-block__content li`,
			props['custom-formats']
		),
		...getCustomFormatsStyles(
			!isList
				? `${uniqueID}:hover .maxi-text-block__content`
				: `${uniqueID}:hover .maxi-text-block__content li`,
			props['custom-formats-hover'],
			true
		),
	};

	return response;
};

export default getStyles;

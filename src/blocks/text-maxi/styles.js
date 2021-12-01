import { getGroupAttributes, stylesCleaner } from '../../extensions/styles';
import {
	getAlignmentTextStyles,
	getBlockBackgroundStyles,
	getBorderStyles,
	getBoxShadowStyles,
	getCustomFormatsStyles,
	getDisplayStyles,
	getLinkStyles,
	getMarginPaddingStyles,
	getOpacityStyles,
	getOverflowStyles,
	getPositionStyles,
	getSizeStyles,
	getTransformStyles,
	getTransitionStyles,
	getTypographyStyles,
	getZIndexStyles,
} from '../../extensions/styles/helpers';
import { selectorsText } from './custom-css';


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
			obj: { ...getGroupAttributes(props, 'margin') },
		}),
		padding: getMarginPaddingStyles({
			obj: { ...getGroupAttributes(props, 'padding') },
		}),
		textAlignment: getAlignmentTextStyles({
			...getGroupAttributes(props, 'textAlignment'),
		}),
		overflow: getOverflowStyles({
			...getGroupAttributes(props, 'overflow'),
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

const getLinkObject = props => {
	const response = {
		transitionDuration: getTransitionStyles({
			...getGroupAttributes(props, 'transitionDuration'),
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
		[uniqueID]: stylesCleaner({
			'': getNormalObject(props),
			' .maxi-text-block--link, .maxi-text-block--link span':
				getLinkObject(props),
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
			...getBlockBackgroundStyles({
				...getGroupAttributes(props, [
					'blockBackground',
					'border',
					'borderWidth',
					'borderRadius',
				]),
				blockStyle: props.parentBlockStyle,
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
		selectorsText,
		props
		),
	};
};

export default getStyles;

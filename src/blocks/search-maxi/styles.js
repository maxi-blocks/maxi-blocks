/**
 * External dependencies
 */
import { merge } from 'lodash';

/**
 * Internal dependencies
 */
import { getGroupAttributes, stylesCleaner } from '../../extensions/styles';
import {
	getBackgroundStyles,
	getBorderStyles,
	getBoxShadowStyles,
	getDisplayStyles,
	getFlexStyles,
	getMarginPaddingStyles,
	getOpacityStyles,
	getOverflowStyles,
	getPositionStyles,
	getSizeStyles,
	getButtonIconStyles,
	getTransformStyles,
	getTypographyStyles,
	getTransitionStyles,
	getZIndexStyles,
} from '../../extensions/styles/helpers';
import { selectorsSearch } from './custom-css';

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
		}),
		margin: getMarginPaddingStyles({
			obj: { ...getGroupAttributes(props, 'margin') },
		}),
		padding: getMarginPaddingStyles({
			obj: { ...getGroupAttributes(props, 'padding') },
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
		transform: getTransformStyles({
			...getGroupAttributes(props, 'transform'),
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

const getSearchButtonStyles = (props, isHover = false) => {
	const prefix = 'search-button-';

	const { blockStyle } = props;

	const response = {
		...getBackgroundStyles({
			...getGroupAttributes(
				props,
				['background', 'backgroundColor'],
				isHover,
				prefix
			),
			isHover,
			blockStyle,
			prefix,
		}),
		border: getBorderStyles({
			obj: {
				...getGroupAttributes(
					props,
					['border', 'borderWidth', 'borderRadius'],
					isHover,
					prefix
				),
			},
			isHover,
			prefix,
			blockStyle: props.blockStyle,
		}),
		...(!isHover && {
			margin: getMarginPaddingStyles({
				obj: { ...getGroupAttributes(props, 'margin', false, prefix) },
				prefix,
			}),
			padding: getMarginPaddingStyles({
				obj: { ...getGroupAttributes(props, 'padding', false, prefix) },
				prefix,
			}),
		}),
	};
	// console.log(response);
	return response;
};

const getSearchButtonIconStyles = props => {
	const { blockStyle, searchButtonSkin } = props;

	const searchButtonIsIcon = searchButtonSkin === 'icon';

	const response = {
		...(searchButtonIsIcon && {
			...getButtonIconStyles({
				obj: props,
				blockStyle,
				target: ' .maxi-search-block__button__icon',
				wrapperTarget: ' .maxi-search-block__button',
			}),
			...getButtonIconStyles({
				obj: props,
				blockStyle,
				isHover: true,
				target: ' .maxi-search-block__button__icon',
				wrapperTarget: ' .maxi-search-block__button',
			}),
		}),
	};

	return response;
};

const getSearchButtonContentStyles = props => {
	const { blockStyle } = props;

	const response = {
		typography: getTypographyStyles({
			obj: {
				...getGroupAttributes(
					props,
					'typography',
					false,
					'search-button-'
				),
			},
			blockStyle,
			prefix: 'search-button-',
		}),
	};

	return response;
};

const getSearchInputStyles = (props, isHover = false) => {
	const prefix = 'search-input-';

	const { blockStyle } = props;

	const response = {
		...getBackgroundStyles({
			...getGroupAttributes(
				props,
				['background', 'backgroundColor'],
				isHover,
				prefix
			),
			isHover,
			prefix,
			blockStyle,
		}),
		border: getBorderStyles({
			obj: {
				...getGroupAttributes(
					props,
					['border', 'borderWidth', 'borderRadius'],
					isHover,
					prefix
				),
			},
			isHover,
			prefix,
			blockStyle,
		}),
		...(!isHover && {
			padding: getMarginPaddingStyles({
				obj: {
					...getGroupAttributes(props, 'padding', false, prefix),
				},
				prefix,
			}),
		}),
		typography: getTypographyStyles({
			obj: {
				...getGroupAttributes(props, 'typography', isHover, prefix),
			},
			blockStyle,
			isHover,
			prefix,
		}),
	};

	return response;
};

const getStyles = props => {
	const { uniqueID } = props;

	const response = {
		[uniqueID]: stylesCleaner(
			merge(
				{
					'': getNormalObject(props),
					':hover': getHoverObject(props),
					' .maxi-search-block__input': getSearchInputStyles(props),
					':hover .maxi-search-block__input': getSearchInputStyles(
						props,
						true
					),
					' .maxi-search-block__button': getSearchButtonStyles(props),
					':hover .maxi-search-block__button': getSearchButtonStyles(
						props,
						true
					),
					...getSearchButtonIconStyles(props),
					' .maxi-search-block__button__content':
						getSearchButtonContentStyles(props),
				},
				...getTransitionStyles(props)
			),
			selectorsSearch,
			props
		),
	};
	console.log(response);
	return response;
};

export default getStyles;

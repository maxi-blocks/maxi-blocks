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
import transitionObj from './transitionObj';
import {
	closeIconPrefix,
	searchButtonPrefix,
	searchInputPrefix,
} from './prefixes';

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
	const { blockStyle } = props;

	const response = {
		...getBackgroundStyles({
			...getGroupAttributes(
				props,
				['background', 'backgroundColor'],
				isHover,
				searchButtonPrefix
			),
			isHover,
			blockStyle,
			prefix: searchButtonPrefix,
		}),
		border: getBorderStyles({
			obj: {
				...getGroupAttributes(
					props,
					['border', 'borderWidth', 'borderRadius'],
					isHover,
					searchButtonPrefix
				),
			},
			isHover,
			prefix: searchButtonPrefix,
			blockStyle: props.blockStyle,
		}),
		...(!isHover && {
			margin: getMarginPaddingStyles({
				obj: {
					...getGroupAttributes(
						props,
						'margin',
						false,
						searchButtonPrefix
					),
				},
				prefix: searchButtonPrefix,
			}),
			padding: getMarginPaddingStyles({
				obj: {
					...getGroupAttributes(
						props,
						'padding',
						false,
						searchButtonPrefix
					),
				},
				prefix: searchButtonPrefix,
			}),
		}),
	};

	return response;
};

const getSearchButtonIconStyles = props => {
	const { blockStyle, searchButtonSkin, skin } = props;

	const searchButtonIsIcon = searchButtonSkin === 'icon';

	const response = {
		...(searchButtonIsIcon && {
			...getButtonIconStyles({
				obj: props,
				blockStyle,
				target: ` .maxi-search-block__button__icon--${
					skin === 'icon-reveal' ? 'closed' : 'open'
				}`,
				wrapperTarget: ' .maxi-search-block__button',
			}),
			...getButtonIconStyles({
				obj: props,
				blockStyle,
				isHover: true,
				target: ` .maxi-search-block__button__icon--${
					skin === 'icon-reveal' ? 'closed' : 'open'
				}`,
				wrapperTarget: ' .maxi-search-block__button',
			}),
		}),
		...(skin === 'icon-reveal' && {
			...getButtonIconStyles({
				obj: props,
				blockStyle,
				target: ' .maxi-search-block__button__icon--open',
				wrapperTarget: ' .maxi-search-block__button',
				prefix: closeIconPrefix,
			}),
			...getButtonIconStyles({
				obj: props,
				blockStyle,
				isHover: true,
				target: ' .maxi-search-block__button__icon--open',
				wrapperTarget: ' .maxi-search-block__button',
				prefix: closeIconPrefix,
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
					searchButtonPrefix
				),
			},
			blockStyle,
			prefix: searchButtonPrefix,
		}),
	};

	return response;
};

const getSearchInputStyles = (props, isHover = false) => {
	const { blockStyle } = props;

	const response = {
		...getBackgroundStyles({
			...getGroupAttributes(
				props,
				['background', 'backgroundColor'],
				isHover,
				searchInputPrefix
			),
			isHover,
			prefix: searchInputPrefix,
			blockStyle,
		}),
		border: getBorderStyles({
			obj: {
				...getGroupAttributes(
					props,
					['border', 'borderWidth', 'borderRadius'],
					isHover,
					searchInputPrefix
				),
			},
			isHover,
			prefix: searchInputPrefix,
			blockStyle,
		}),
		...(!isHover && {
			padding: getMarginPaddingStyles({
				obj: {
					...getGroupAttributes(
						props,
						'padding',
						false,
						searchInputPrefix
					),
				},
				prefix: searchInputPrefix,
			}),
		}),
		typography: getTypographyStyles({
			obj: {
				...getGroupAttributes(
					props,
					'typography',
					isHover,
					searchInputPrefix
				),
			},
			blockStyle,
			isHover,
			prefix: searchInputPrefix,
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
				...getTransitionStyles(props, transitionObj)
			),
			selectorsSearch,
			props
		),
	};

	return response;
};

export default getStyles;

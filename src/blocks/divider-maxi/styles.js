/**
 * External dependencies
 */
import { merge } from 'lodash';

/**
 * Internal dependencies
 */
import { getGroupAttributes, stylesCleaner } from '../../extensions/styles';
import {
	getBlockBackgroundStyles,
	getBorderStyles,
	getBoxShadowStyles,
	getDisplayStyles,
	getDividerStyles,
	getMarginPaddingStyles,
	getOpacityStyles,
	getOverflowStyles,
	getPositionStyles,
	getSizeStyles,
	getTransformStyles,
	getTransitionStyles,
	getZIndexStyles,
	getFlexStyles,
} from '../../extensions/styles/helpers';
import { selectorsDivider } from './custom-css';
import transitionObj from './transitionObj';

const getWrapperObject = props => {
	const { lineAlign, lineVertical, lineHorizontal } = props;

	const response = {
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
		boxShadow: getBoxShadowStyles({
			obj: {
				...getGroupAttributes(props, 'boxShadow'),
			},
			blockStyle: props.blockStyle,
		}),
		size: getSizeStyles({
			...getGroupAttributes(props, 'size'),
			fullWidth: props.blockFullWidth,
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
		opacity: getOpacityStyles({
			...getGroupAttributes(props, 'opacity'),
		}),
		divider: getDividerStyles(
			{
				...getGroupAttributes(props, 'divider'),
				lineAlign,
				lineVertical,
				lineHorizontal,
			},
			null,
			props.blockStyle
		),
		overflow: getOverflowStyles({
			...getGroupAttributes(props, 'overflow'),
		}),
		flex: getFlexStyles({
			...getGroupAttributes(props, 'flex'),
		}),
	};

	return response;
};

const getHoverWrapperObject = props => {
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

const getDividerObject = props => {
	const { lineOrientation } = props;

	const response = {
		divider: getDividerStyles(
			{
				...getGroupAttributes(props, 'divider'),
				lineOrientation,
			},
			'line',
			props.blockStyle
		),
		boxShadow: getBoxShadowStyles({
			obj: {
				...getGroupAttributes(props, 'boxShadow', false, 'divider-'),
			},
			blockStyle: props.blockStyle,
			prefix: 'divider-',
		}),
	};

	return response;
};

const getHoverObject = props => {
	const response = {
		boxShadow:
			props['divider-box-shadow-status-hover'] &&
			getBoxShadowStyles({
				obj: {
					...getGroupAttributes(props, 'boxShadow', true, 'divider-'),
				},
				isHover: true,
				blockStyle: props.blockStyle,
				prefix: 'divider-',
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
					'': getWrapperObject(props),
					':hover': getHoverWrapperObject(props),
					' hr.maxi-divider-block__divider:hover':
						getHoverObject(props),
					' hr.maxi-divider-block__divider': getDividerObject(props),
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
				...getTransitionStyles(props, transitionObj)
			),
			selectorsDivider,
			props
		),
	};

	return response;
};

export default getStyles;

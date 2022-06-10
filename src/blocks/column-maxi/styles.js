/**
 * External dependencies
 */
import { merge } from 'lodash';

/**
 * Internal dependencies
 */
import { getGroupAttributes, stylesCleaner } from '../../extensions/styles';
import {
	getBoxShadowStyles,
	getZIndexStyles,
	getColumnSizeStyles,
	getDisplayStyles,
	getTransformStyles,
	getMarginPaddingStyles,
	getBlockBackgroundStyles,
	getBorderStyles,
	getOpacityStyles,
	getOverflowStyles,
	getFlexStyles,
	getSizeStyles,
	getTransitionStyles,
} from '../../extensions/styles/helpers';
import { selectorsColumn } from './custom-css';

const getNormalObject = (props, rowGapProps, clientId) => {
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
		columnSize: {
			...getColumnSizeStyles(
				{
					...getGroupAttributes(props, 'columnSize'),
				},
				rowGapProps,
				clientId
			),
		},
		size: getSizeStyles({
			...getGroupAttributes(props, 'size'),
			fullWidth: props.blockFullWidth,
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

const getStyles = (props, rowGapProps, clientId) => {
	const { uniqueID } = props;

	const response = {
		[uniqueID]: stylesCleaner(
			merge(
				{
					'': getNormalObject(props, rowGapProps, clientId),
					':hover': getHoverObject(props),
					...getBlockBackgroundStyles({
						...getGroupAttributes(props, [
							'blockBackground',
							'border',
							'borderWidth',
							'borderRadius',
						]),
						blockStyle: props.blockStyle,
						rowBorderRadius: props.rowBorderRadius,
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
						rowBorderRadius: props.rowBorderRadius,
					}),
				},
				...getTransitionStyles(props),
				...getTransformStyles(
					{
						...getGroupAttributes(props, 'transform'),
					},
					selectorsColumn
				)
			),
			selectorsColumn,
			props
		),
	};

	return response;
};

export default getStyles;

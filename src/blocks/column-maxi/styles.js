/**
 * Internal dependencies
 */
import { getGroupAttributes, styleProcessor } from '@extensions/styles';
import {
	getBoxShadowStyles,
	getZIndexStyles,
	getColumnSizeStyles,
	getDisplayStyles,
	getMarginPaddingStyles,
	getBlockBackgroundStyles,
	getBorderStyles,
	getOpacityStyles,
	getOverflowStyles,
	getFlexStyles,
	getSizeStyles,
	getPaginationStyles,
	getPaginationLinksStyles,
	getPaginationColours,
} from '@extensions/styles/helpers';
import data from './data';

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
		opacity:
			props['opacity-status-hover'] &&
			getOpacityStyles(
				{ ...getGroupAttributes(props, 'opacity', true) },
				true
			),
	};

	return response;
};

const getStyles = (props, rowGapProps, clientId) => {
	const { uniqueID } = props;

	const response = {
		[uniqueID]: styleProcessor(
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
				...(props['cl-pagination'] && {
					' .maxi-pagination': getPaginationStyles(props),
					' .maxi-pagination a': getPaginationLinksStyles(props),
					' .maxi-pagination .maxi-pagination__pages > span':
						getPaginationLinksStyles(props),
					' .maxi-pagination a:hover': getPaginationColours(
						props,
						'hover'
					),
					' .maxi-pagination .maxi-pagination__pages > span.maxi-pagination__link--current':
						getPaginationColours(props, 'current'),
				}),
			},
			data,
			props
		),
	};

	return response;
};

export default getStyles;

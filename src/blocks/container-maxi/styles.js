/**
 * Internal dependencies
 */
import { getGroupAttributes, styleProcessor } from '@extensions/styles';
import {
	getBorderStyles,
	getSizeStyles,
	getBoxShadowStyles,
	getOpacityStyles,
	getZIndexStyles,
	getPositionStyles,
	getDisplayStyles,
	getBlockBackgroundStyles,
	getArrowStyles,
	getMarginPaddingStyles,
	getShapeDividerStyles,
	getShapeDividerSVGStyles,
	getOverflowStyles,
	getFlexStyles,
	getPaginationStyles,
	getPaginationLinksStyles,
	getPaginationColours,
} from '@extensions/styles/helpers';
import data from './data';

const getStyleCardGroupAttributes = (
	props,
	target,
	isHover = false,
	prefix = ''
) => getGroupAttributes(props, target, isHover, prefix, false, true);

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
			blockStyle: props.blockStyle,
		}),
		size: getSizeStyles({
			...getStyleCardGroupAttributes(props, 'size'),
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
		overflow: getOverflowStyles({
			...getGroupAttributes(props, 'overflow'),
		}),
		margin: getMarginPaddingStyles({
			obj: {
				...getStyleCardGroupAttributes(props, 'margin'),
			},
		}),
		padding: getMarginPaddingStyles({
			obj: {
				...getStyleCardGroupAttributes(props, 'padding'),
			},
		}),
		flex: getFlexStyles({
			...getStyleCardGroupAttributes(props, 'flex'),
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

const getStyles = props => {
	const { uniqueID } = props;

	const response = {
		[uniqueID]: styleProcessor(
			{
				'': getNormalObject(props),
				':hover': getHoverObject(props),
				...(props['shape-divider-top-status'] && {
					' .maxi-shape-divider__top': {
						shapeDivider: {
							...getShapeDividerStyles(
								{
									...getStyleCardGroupAttributes(props, [
										'shapeDivider',
										'padding',
									]),
								},
								'top'
							),
						},
					},
					' .maxi-shape-divider__top svg': {
						shapeDivider: {
							...getShapeDividerSVGStyles(
								{
									...getStyleCardGroupAttributes(props, [
										'shapeDivider',
										'padding',
									]),
								},
								'top',
								props.blockStyle
							),
						},
					},
				}),
				...(props['shape-divider-bottom-status'] && {
					' .maxi-shape-divider__bottom': {
						shapeDivider: {
							...getShapeDividerStyles(
								{
									...getStyleCardGroupAttributes(props, [
										'shapeDivider',
										'padding',
									]),
								},
								'bottom'
							),
						},
					},
					' .maxi-shape-divider__bottom svg': {
						shapeDivider: {
							...getShapeDividerSVGStyles(
								{
									...getStyleCardGroupAttributes(props, [
										'shapeDivider',
										'padding',
									]),
								},
								'bottom',
								props.blockStyle
							),
						},
					},
				}),
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
				...getArrowStyles({
					...getGroupAttributes(props, [
						'arrow',
						'border',
						'borderWidth',
						'borderRadius',
						'blockBackground',
						'boxShadow',
					]),
					blockStyle: props.blockStyle,
					transition: props.transition,
				}),
				...getArrowStyles({
					...getGroupAttributes(
						props,
						[
							'arrow',
							'border',
							'borderWidth',
							'borderRadius',
							'blockBackground',
							'boxShadow',
						],
						true
					),
					...getGroupAttributes(props, ['arrow']),
					blockStyle: props.blockStyle,
					isHover: true,
					transition: props.transition,
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

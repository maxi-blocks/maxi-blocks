/**
 * Internal dependencies
 */
import {
	getGroupAttributes,
	styleProcessor,
	getAttributeValue,
	getColorRGBAString,
} from '../../extensions/styles';
import {
	getSizeStyles,
	getBoxShadowStyles,
	getZIndexStyles,
	getPositionStyles,
	getDisplayStyles,
	getMarginPaddingStyles,
	getBlockBackgroundStyles,
	getBorderStyles,
	getOpacityStyles,
	getOverflowStyles,
	getFlexStyles,
	getTypographyStyles,
} from '../../extensions/styles/helpers';
import data from './data';

const getNormalObject = props => {
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
		size: getSizeStyles({
			...getGroupAttributes(props, 'size'),
		}),
		margin: getMarginPaddingStyles({
			obj: { ...getGroupAttributes(props, 'margin') },
		}),
		padding: getMarginPaddingStyles({
			obj: { ...getGroupAttributes(props, 'padding') },
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
		row: {
			general: {},
		},
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

const getPaginationStyles = props => {
	const clPaginationPrefix = 'cl-pagination-';

	const response = {
		flex: getFlexStyles(
			{
				...getGroupAttributes(props, 'flex', false, clPaginationPrefix),
			},
			clPaginationPrefix
		),
	};

	return response;
};

const getPaginationLinksStyles = props => {
	const { blockStyle } = props;
	const clPaginationPrefix = 'cl-pagination-';

	const response = {
		typography: getTypographyStyles({
			obj: {
				...getGroupAttributes(
					props,
					'typography',
					false,
					clPaginationPrefix
				),
			},
			isHover: false,
			blockStyle,
			prefix: clPaginationPrefix,
		}),
	};

	return response;
};

const getPaginationColours = (props, type) => {
	const { blockStyle } = props;

	let response = {};

	const prefix = `cl-pagination-link-${type}-`;

	const paletteStatus = getAttributeValue({
		target: `${prefix}palette-status`,
		props,
	});

	const paletteColor = getAttributeValue({
		target: `${prefix}palette-color`,
		props,
	});

	const paletteOpacity = getAttributeValue({
		target: `${prefix}palette-opacity`,
		props,
	});

	const color = getAttributeValue({
		target: `${prefix}placeholder-color`,
		props,
	});

	if (paletteStatus) {
		response = {
			color: getColorRGBAString({
				firstVar: `color-${paletteColor}`,
				opacity: paletteOpacity,
				blockStyle,
			}),
		};
	} else if (color) {
		response = {
			color,
		};
	}

	return { [type]: { general: response } };
};

const getStyles = props => {
	const { uniqueID } = props;

	const response = {
		[uniqueID]: styleProcessor(
			{
				'': getNormalObject(props),
				':hover': getHoverObject(props),
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
				...(props['cl-pagination'] && {
					' .maxi-pagination': getPaginationStyles(props),
					' .maxi-pagination a': getPaginationLinksStyles(props),
					' .maxi-pagination a:hover': getPaginationColours(
						props,
						'hover'
					),
					' .maxi-pagination a.maxi-pagination__link--current':
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

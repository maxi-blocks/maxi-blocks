/**
 * Internal dependencies
 */
import getGroupAttributes from '@extensions/styles/getGroupAttributes';
import getAttributeValue from '@extensions/styles/getAttributeValue';
import getColorRGBAString from '@extensions/styles/getColorRGBAString';
import getFlexStyles from './getFlexStyles';
import getTypographyStyles from './getTypographyStyles';

export const getPaginationStyles = props => {
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

export const getPaginationLinksStyles = props => {
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

export const getPaginationColours = (props, type) => {
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

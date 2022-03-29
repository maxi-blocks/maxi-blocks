/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

/**
 * Styles & Icons
 */
import { getGroupAttributes } from '../../../../extensions/styles';

const ATTRIBUTES = [
	'alignment',
	'arrow',
	'background',
	'backgroundColor',
	'backgroundGradient',
	'blockBackground',
	'border',
	'borderRadius',
	'borderWidth',
	'boxShadow',
	'breakpoints',
	'columnSize',
	'display',
	'divider',
	'link',
	'margin',
	'motion',
	'opacity',
	'padding',
	'position',
	'shapeDivider',
	'size',
	'textAlignment',
	'transform',
	'transitionDuration',
	'typography',
	'zIndex',
];
const HOVER_ATTRIBUTES = [
	'backgroundHover',
	'backgroundColorHover',
	'backgroundGradientHover',
	'borderHover',
	'borderRadiusHover',
	'borderWidthHover',
	'boxShadowHover',
	'typographyHover',
];

export const cleanStyleAttributes = (attr, blockName) => {
	let response = {};
	switch (blockName) {
		case 'maxi-blocks/button-maxi':
			// for the canvas
			ATTRIBUTES.forEach(typeAttr => {
				response = {
					...response,
					...getGroupAttributes(attr, typeAttr, false, '', true),
				};
			});
			// for button maxi
			ATTRIBUTES.forEach(typeAttr => {
				response = {
					...response,
					...getGroupAttributes(
						attr,
						typeAttr,
						false,
						'button-',
						true
					),
				};
			});
			// for button maxi hover
			HOVER_ATTRIBUTES.forEach(typeAttr => {
				response = {
					...response,
					...getGroupAttributes(
						attr,
						typeAttr,
						true,
						'button-',
						true
					),
				};
			});
			break;
		default:
			break;
	}
	return response;
};

export const getOrganizedAttributes = attributes => {
	const response = {};

	ATTRIBUTES.forEach(attr => {
		const obj = getGroupAttributes(attributes, attr, false, '', true);

		if (!isEmpty(obj)) response[`Canvas ${attr}`] = obj;
	});

	ATTRIBUTES.forEach(attr => {
		const obj = getGroupAttributes(
			attributes,
			attr,
			false,
			'button-',
			true
		);

		if (!isEmpty(obj)) response[attr] = obj;
	});

	HOVER_ATTRIBUTES.forEach(attr => {
		const obj = getGroupAttributes(attributes, attr, true, 'button-', true);

		if (!isEmpty(obj)) response[attr] = obj;
	});

	return response;
};

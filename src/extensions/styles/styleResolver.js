/**
 * WordPress dependencies
 */
import { dispatch } from '@wordpress/data';

/**
 * External dependencies
 */
import { isEmpty, isNumber, isBoolean, isObject, merge, isEqual } from 'lodash';

/**
 * Styles resolver
 */
const BREAKPOINTS = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

const cleanContent = content => {
	let newContent = { ...content };

	for (const prop in newContent) {
		if (
			(isEmpty(newContent[prop]) &&
				!isNumber(newContent[prop]) &&
				!isBoolean(newContent[prop])) ||
			prop === 'label'
		)
			delete newContent[prop];
		else if (isObject(newContent[prop])) {
			if (BREAKPOINTS.includes(prop))
				newContent[prop] = cleanContent(newContent[prop]);
			else {
				newContent = merge(newContent, cleanContent(newContent[prop]));
				delete newContent[prop];
			}
		}
	}

	return newContent;
};

const getCleanContent = content => {
	const newContent = { ...content };

	// eslint-disable-next-line guard-for-in
	for (const target in newContent) {
		if (isObject(newContent[target]))
			newContent[target] = cleanContent(newContent[target]);

		if (isEmpty(newContent[target])) delete newContent[target];
		if (isEqual(newContent[target], { general: {} }))
			delete newContent[target];
	}

	return newContent;
};

const styleResolver = ({ styles, remover = false, breakpoints, uniqueID }) => {
	if (!styles) return {};

	const response = (remover && []) || {};

	Object.entries(styles).forEach(([target, props]) => {
		if (!remover) {
			if (!response[target])
				response[target] = {
					uniqueID,
					breakpoints,
					content: {},
				};
			response[target].content = props;
		}
		if (remover) response.push(target);

		if (response?.[target]?.content)
			response[target].content = getCleanContent(
				response[target].content
			);

		if (!remover)
			dispatch('maxiBlocks/styles').updateStyles(target, response);
		else dispatch('maxiBlocks/styles').removeStyles(response);
	});

	return response;
};

export default styleResolver;

/**
 * External dependencies
 */
import { upperCase, uniq } from 'lodash';

import { getDefaultAttribute } from '../styles';

const getActiveAttributes = (attributes, type, props) => {
	const response = [];
	Object.keys(attributes).forEach(
		key => attributes[key] === undefined && delete attributes[key]
	);

	if (type === 'typography') {
		Object.keys(attributes).forEach(key => {
			const breakpoint = key?.split('-')?.pop();
			breakpoint !== 'general' && response?.push(upperCase(breakpoint));
		});
	}

	if (type === 'link') {
		Object.keys(attributes).forEach(key => {
			let tab;
			const value = props[key];
			const defaultValue = getDefaultAttribute(key);
			if (value !== undefined && value !== defaultValue) {
				if (key.includes('active')) tab = 'active_link';
				else if (key.includes('hover')) tab = 'hover_link';
				else if (key.includes('visited')) tab = 'visited_link';
				else tab = 'normal_link';
			}

			if (tab) response.push(tab);
		});
	}

	if (type === 'custom-css') {
		Object.keys(attributes)?.forEach(key => {
			const breakpoint = key?.split('-')?.pop();
			breakpoint !== 'general' &&
				breakpoint !== 'category' &&
				response?.push(upperCase(breakpoint));
		});
	}

	if (type === 'transform') {
		Object.keys(attributes)?.forEach(key => {
			let tab;
			const value = props[key];
			const defaultValue = getDefaultAttribute(key);
			if (value !== undefined && value !== defaultValue) {
				if (key.includes('scale')) tab = 'scale';
				else if (key.includes('rotate')) tab = 'rotate';
				else if (key.includes('translate')) tab = 'translate';
				else tab = 'origin';
			}

			if (tab) response.push(tab);
		});
	}
	console.log(`type: ${type}`);
	console.log(uniq(response));

	return uniq(response);
};

export default getActiveAttributes;

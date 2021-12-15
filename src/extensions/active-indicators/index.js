/**
 * External dependencies
 */
import { upperCase, uniq, isEmpty, remove, cloneDeep, isEqual } from 'lodash';

import { getDefaultAttribute } from '../styles';

const getActiveAttributes = (attributes, type) => {
	const response = [];
	const attr = cloneDeep(attributes);

	Object.keys(attr).forEach(key => {
		if (attr[key] === undefined) delete attr[key];
	});

	const breakpoints = ['XXL', 'XL', 'L', 'M', 'S', 'XS'];

	if (type === 'breakpoints') {
		Object.keys(attr).forEach(key => {
			let breakpoint;
			const value = attr?.[key];
			const defaultValue = getDefaultAttribute(key);
			if (key.includes('-')) {
				breakpoint = key?.split('-')?.pop();
				breakpoints.includes(upperCase(breakpoint)) &&
					value !== defaultValue &&
					response?.push(upperCase(breakpoint));
			}
		});
	}

	if (type === 'typography') {
		Object.keys(attr).forEach(key => {
			let tab;
			const value = attr[key];
			const defaultValue = getDefaultAttribute(key);
			if (key.includes('-hover') && value !== defaultValue)
				tab = 'Hover state';
			else if (value !== defaultValue) tab = 'Normal state';
			else remove(tab, 'Normal state');

			if (tab) response.push(tab);
		});
	}

	if (type === 'link') {
		Object.keys(attr).forEach(key => {
			let tab;
			const value = attr[key];
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
		Object.keys(attr)?.forEach(key => {
			const breakpoint = key?.split('-')?.pop();
			breakpoint !== 'general' &&
				breakpoint !== 'category' &&
				response?.push(upperCase(breakpoint));
		});
	}

	if (type === 'transform') {
		Object.keys(attr)?.forEach(key => {
			let tab;
			const value = attr[key];
			const defaultValue = getDefaultAttribute(key);
			if (value && value !== defaultValue) {
				if (key.includes('scale')) tab = 'scale';
				else if (key.includes('rotate')) tab = 'rotate';
				else if (key.includes('translate')) tab = 'translate';
				else tab = 'origin';
			}

			if (tab) response.push(tab);
		});
	}

	if (type === 'icon') {
		Object.keys(attr).forEach(key => {
			let tab;
			if (key.includes('-hover') && !!attr[key]) tab = 'Hover state';
			else if (!isEmpty(attr[key])) tab = 'Normal state';

			if (tab) response.push(tab);
		});
	}

	if (type === 'simple-background') {
		Object.keys(attr).forEach(key => {
			let tab;
			if (key.includes('-hover') && !!attr[key]) tab = 'Hover state';
			else if (attr[key] !== 'none') tab = 'Normal state';
			else remove(tab, 'Normal state');

			if (tab) response.push(tab);
		});
	}

	if (type === 'border' || type === 'box-shadow') {
		Object.keys(attr).forEach(key => {
			let tab;
			const check =
				type === 'border' ? 'border-style-' : 'box-shadow-blur';
			if (key.includes(check) && !key.includes('hover') && !!attr[key])
				tab = 'Normal state';

			if (key.includes('-status-hover') && !!attr[key]) {
				tab = 'Hover state';
			}

			if (tab) response.push(tab);
		});
	}

	if (type === 'background') {
		Object.keys(attr).forEach(key => {
			let tab;
			const layers = cloneDeep(attr[key]);
			const defaultLayers = getDefaultAttribute(key);
			if (
				key.includes('background-layers') &&
				!isEmpty(layers) &&
				!isEqual(layers, defaultLayers)
			)
				tab = 'Normal state';

			if (key.includes('background-hover-status') && !!attr[key])
				tab = 'Hover state';

			if (tab) response.push(tab);
		});
	}

	if (type === 'shape-divider') {
		let tab;
		if (attr['shape-divider-top-status']) tab = 'Top shape divider';
		if (attr['shape-divider-bottom-status']) tab = 'Bottom shape divider';
		if (tab) response.push(tab);
	}

	if (type === 'image-parallax') {
		Object.keys(attr).forEach(key => {
			let tab;
			const value = attr[key];
			const defaultValue = getDefaultAttribute(key);
			if (
				value &&
				key.includes('background') &&
				!key.includes('parallax') &&
				value !== defaultValue
			)
				tab = 'Settings';

			if (key === 'background-image-parallax-status' && value)
				tab = 'Parallax';

			if (tab) response.push(tab);
		});
	}

	if (type === 'svg-position') {
		Object.keys(attr).forEach(key => {
			let tab;
			const value = attr[key];
			const defaultValue = getDefaultAttribute(key);
			if (value && value !== defaultValue) {
				if (key.includes('position') && !key.includes('size'))
					tab = 'Position';
				if (!key.includes('position') && key.includes('size'))
					tab = 'Size';
			}

			if (tab) response.push(tab);
		});
	}

	if (type === 'svg-fill') {
		let tab;
		const svgData = Object.values(attr)[0];

		!isEmpty(svgData) &&
			Object.keys(svgData).forEach(key => {
				const value = svgData[key];
				if (
					key.includes('color') &&
					(typeof value === 'undefined' || !isEmpty(value)) // undefined is a component's bug for palette colors
				)
					tab = 'Colour';
				if (key.includes('image') && !isEmpty(value)) tab = 'Image';

				if (tab) response.push(tab);
			});
	}

	return uniq(response);
};

export default getActiveAttributes;

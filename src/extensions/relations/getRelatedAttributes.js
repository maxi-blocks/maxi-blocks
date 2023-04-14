/**
 * Internal dependencies
 */
import getBreakpointFromAttribute from '../styles/getBreakpointFromAttribute';

/**
 * External dependencies
 */
import { omitBy, isNil, compact } from 'lodash';

/**
 * Adds to IB attributes object the attributes that are related to the current
 * saving attributes to ensure the changes done on the affected block aren't modifying
 * the IB attributes and styles.
 */
const getRelatedAttributes = ({
	props: propsObj,
	IBAttributes = {},
	relatedAttributes = [],
}) => {
	const attributes = {};

	const props = Object.fromEntries(
		Object.entries(omitBy(propsObj, isNil)).filter(
			([key]) => !key.includes('-hover')
		)
	);

	const propsArray = compact(
		Object.keys(IBAttributes).map(prop => {
			const key = relatedAttributes.find(key => prop.includes(key));

			if (key) return [prop, key];

			return null;
		})
	);

	propsArray.forEach(([prop, key]) => {
		relatedAttributes.forEach(value => {
			if (value !== key) {
				const replacedKey = prop.replace(key, value);

				attributes[replacedKey] = props[replacedKey];
			}
		});
	});

	// add unit attributes when needed
	Object.keys(IBAttributes).forEach(key => {
		const breakpoint = getBreakpointFromAttribute(key);

		if (!breakpoint) return;

		// Ensure the value for unit attributes is saved if the modified value is related
		if (key.includes('-unit')) {
			const newKey = key.replace('-unit', '');

			if (props[newKey]) attributes[newKey] = props[newKey];
		}

		const unitKey = key.replace(`-${breakpoint}`, `-unit-${breakpoint}`);

		if (props[unitKey]) attributes[unitKey] = props[unitKey];

		// Ensure the palette attributes pack is passed if the modified value is related
		if (key.includes('palette')) {
			const paletteStatusKey = key
				.replace('palette-color', 'palette-status')
				.replace('palette-opacity', 'palette-status');
			const paletteColorKey = key
				.replace('palette-opacity', 'palette-color')
				.replace('palette-status', 'palette-color');
			const paletteOpacityKey = key
				.replace('palette-color', 'palette-opacity')
				.replace('palette-status', 'palette-opacity');
			// Replace the last 'palette-color' or 'palette-opacity' with 'color'
			const colorKey = key.replace(/palette-(color|opacity)$/, 'color');

			if (props[paletteStatusKey] && !IBAttributes[paletteStatusKey])
				attributes[paletteStatusKey] = props[paletteStatusKey];

			if (props[paletteColorKey] && !IBAttributes[paletteColorKey])
				attributes[paletteColorKey] = props[paletteColorKey];

			if (props[paletteOpacityKey] && !IBAttributes[paletteOpacityKey])
				attributes[paletteOpacityKey] = props[paletteOpacityKey];

			if (props[colorKey] && !IBAttributes[colorKey])
				attributes[colorKey] = props[colorKey];
		}
	});

	return { ...omitBy(attributes, isNil), ...IBAttributes };
};

export default getRelatedAttributes;

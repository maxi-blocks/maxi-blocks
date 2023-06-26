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
	sid,
}) => {
	let attributes = {};

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

	// Add unit and color attributes when needed
	const getUnitAndColorAttributes = (attrs, alternativeProps) => {
		const result = {};
		const propsToCheck = alternativeProps ?? props;

		Object.keys(attrs).forEach(key => {
			const breakpoint = getBreakpointFromAttribute(key);

			const replaceAttribute = key => {
				// For XXL attributes, general IB attribute is default even if block attribute is defined
				if (
					breakpoint === 'xxl' &&
					IBAttributes[key.replace('-xxl', '-general')]
				) {
					result[key] = IBAttributes[key.replace('-xxl', '-general')];
				}
				if (propsToCheck[key]) {
					result[key] = propsToCheck[key];
				}
			};

			// Ensure the value for unit attributes is saved if the modified value is related
			if (key.includes('-unit')) {
				const newKey = key.replace('-unit', '');

				replaceAttribute(newKey);
			}

			const unitKey = key.replace(
				`-${breakpoint}`,
				`-unit-${breakpoint}`
			);
			replaceAttribute(unitKey);

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
				const colorKey = key.replace(
					/palette-(color|opacity)$/,
					'color'
				);

				if (propsToCheck[paletteStatusKey] && !attrs[paletteStatusKey])
					result[paletteStatusKey] = propsToCheck[paletteStatusKey];

				if (propsToCheck[paletteColorKey] && !attrs[paletteColorKey])
					result[paletteColorKey] = propsToCheck[paletteColorKey];

				if (
					propsToCheck[paletteOpacityKey] &&
					!attrs[paletteOpacityKey]
				)
					result[paletteOpacityKey] = propsToCheck[paletteOpacityKey];

				if (propsToCheck[colorKey] && !attrs[colorKey])
					result[colorKey] = propsToCheck[colorKey];
			}
		});

		return result;
	};

	if (sid && sid === 'bgl') {
		if ('background-layers' in IBAttributes)
			IBAttributes['background-layers'].forEach((bgLayer, index) => {
				const bgLayerAttributes = getUnitAndColorAttributes(
					bgLayer,
					props['background-layers'][index]
				);

				IBAttributes['background-layers'][index] = {
					...bgLayer,
					...bgLayerAttributes,
				};
			});
	} else
		attributes = {
			...attributes,
			...getUnitAndColorAttributes(IBAttributes),
		};

	return { ...omitBy(attributes, isNil), ...IBAttributes };
};

export default getRelatedAttributes;

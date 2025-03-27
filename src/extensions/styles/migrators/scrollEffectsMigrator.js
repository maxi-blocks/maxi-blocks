/**
 * Internal dependencies
 */
import { scrollTypes } from '@extensions/styles/defaults/scroll';

// Constants
const NAME = 'Scroll effects zones';

// Pre-compile version set for O(1) lookup
const VERSIONS = new Set([
	'0.1',
	'0.0.1-SC1',
	'0.0.1-SC2',
	'0.0.1-SC3',
	'0.0.1-SC4',
	'0.0.1-SC5',
	'0.0.1-SC6',
	'1.0.0-RC1',
	'1.0.0-RC2',
	'1.0.0-beta',
	'1.0.0-beta-2',
	'wp-directory-beta-1',
	'1.0.0',
	'1.0.1',
	'1.1.0',
	'1.1.1',
	'1.2.0',
	'1.2.1',
	'1.3',
	'1.3.1',
	'1.4.1',
	'1.4.2',
	'1.5.0',
	'1.5.1',
	'1.5.2',
	'1.5.3',
	'1.5.4',
	'1.5.5',
	'1.5.6',
	'1.5.7',
	'1.5.8',
	'1.6.0',
	'1.6.1',
	'1.7.0',
]);

// Pre-define attribute templates for better performance
const createDefaultAttribute = defaultValue => ({
	type: 'number',
	default: defaultValue,
});

const attributes = () => ({
	'scroll-vertical-offset-start-general': createDefaultAttribute(-400),
	'scroll-vertical-offset-mid-general': createDefaultAttribute(0),
	'scroll-vertical-offset-end-general': createDefaultAttribute(400),
	'scroll-horizontal-offset-start-general': createDefaultAttribute(-200),
	'scroll-horizontal-offset-mid-general': createDefaultAttribute(0),
	'scroll-horizontal-offset-end-general': createDefaultAttribute(200),
	'scroll-rotate-rotate-start-general': createDefaultAttribute(90),
	'scroll-rotate-rotate-mid-general': createDefaultAttribute(0),
	'scroll-rotate-rotate-end-general': createDefaultAttribute(0),
	'scroll-scale-scale-start-general': createDefaultAttribute(70),
	'scroll-scale-scale-mid-general': createDefaultAttribute(100),
	'scroll-scale-scale-end-general': createDefaultAttribute(100),
	'scroll-fade-opacity-start-general': createDefaultAttribute(0),
	'scroll-fade-opacity-mid-general': createDefaultAttribute(100),
	'scroll-fade-opacity-end-general': createDefaultAttribute(100),
	'scroll-blur-blur-start-general': createDefaultAttribute(10),
	'scroll-blur-blur-mid-general': createDefaultAttribute(0),
	'scroll-blur-blur-end-general': createDefaultAttribute(0),
});

const isEligible = blockAttributes => {
	const {
		'maxi-version-origin': maxiVersionOrigin,
		'maxi-version-current': maxiVersionCurrent,
	} = blockAttributes;

	return (
		(VERSIONS.has(maxiVersionCurrent) || !maxiVersionOrigin) &&
		scrollTypes.some(
			type => blockAttributes[`scroll-${type}-status-general`]
		)
	);
};

const migrate = attributes => {
	const createZone = prefix => {
		const startAttr = `${prefix}start-general`;
		const midAttr = `${prefix}mid-general`;
		const endAttr = `${prefix}end-general`;
		const midValue = attributes[midAttr];
		const endValue = attributes[endAttr];

		return {
			0: attributes[startAttr],
			...(midValue !== endValue
				? { 50: midValue, 100: endValue }
				: { 50: midValue }),
		};
	};

	// Pre-compute prefixes for better performance
	const prefixes = [
		'scroll-vertical-offset-',
		'scroll-horizontal-offset-',
		'scroll-rotate-rotate-',
		'scroll-scale-scale-',
		'scroll-fade-opacity-',
		'scroll-blur-blur-',
	];

	// Create zones and set block zone flags
	prefixes.forEach(prefix => {
		const type = prefix.split('-')[1];
		attributes[`scroll-${type}-zones-general`] = createZone(prefix);
		attributes[`scroll-${type}-is-block-zone-general`] = true;
	});

	// Delete old attributes
	const attributesToDelete = Object.keys(attributes).filter(key =>
		prefixes.some(prefix => key.startsWith(prefix))
	);

	attributesToDelete.forEach(attr => {
		delete attributes[attr];
	});

	return attributes;
};

export default { name: NAME, attributes, migrate, isEligible };

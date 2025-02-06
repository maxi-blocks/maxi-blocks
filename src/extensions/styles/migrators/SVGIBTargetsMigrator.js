/**
 * Internal dependencies
 */
import { getSVGStyles } from '@extensions/styles/helpers/getSVGStyles';

/**
 * External dependencies
 */
import { merge } from 'lodash';

// Constants
const NAME = 'IB SVG Icon Target';
const BREAKPOINTS = Object.freeze({
	xs: 480,
	s: 767,
	m: 1024,
	l: 1366,
	xl: 1920,
});

const getStyles = (stylesObj, isFirst = false) => {
	// Early return for empty objects
	if (!stylesObj || typeof stylesObj !== 'object') return {};

	// Check if using general breakpoints
	if (Object.keys(stylesObj).some(key => key.includes('general'))) {
		const styles = {};


		for (const [key, breakpoint] of Object.entries(BREAKPOINTS)) {
			if (stylesObj[key]) {
				styles[key] = {
					styles: stylesObj[key],
					breakpoint,
				};
			}
		}

		// Handle xxl and general cases
		if (stylesObj.xxl) {
			styles.xxl = { styles: stylesObj.xxl, breakpoint: null };
		}
		if (stylesObj.general) {
			styles.general = { styles: stylesObj.general, breakpoint: null };
		}

		return styles;
	}

	// Handle nested styles
	const styles = {};
	for (const [key, value] of Object.entries(stylesObj)) {
		if (isFirst && key.includes(':hover')) continue;

		styles[key] = getStyles(value);
	}

	return isFirst ? styles : merge({}, styles);
};

const isEligible = blockAttributes => {
	const { relations } = blockAttributes;
	if (!relations) return false;


	for (const relation of relations) {
		if (relation.uniqueID?.includes('svg-icon-maxi') &&
			relation.settings === 'Icon colour' &&
			!Object.keys(relation.css).some(target =>
				target.includes('svg[data-fill]:not([fill^="none"]) *') ||
				target.includes('svg[data-stroke]:not([stroke^="none"]) *')
			)) {
			return true;
		}
	}
	return false;
};

const migrate = newAttributes => {
	const { relations } = newAttributes;
	if (!relations) return newAttributes;


	for (let i = 0; i < relations.length; i++) {
		const relation = relations[i];
		if (!relation.uniqueID?.includes('svg-icon-maxi')) continue;

		const styles = getSVGStyles({
			obj: relation.attributes,
			target: ' .maxi-svg-icon-block__icon',
			prefix: 'svg-',
			blockStyle: newAttributes.blockStyle,
		});

		relations[i].css = getStyles(styles, true);
	}

	return newAttributes;
};

export default { name: NAME, isEligible, migrate };


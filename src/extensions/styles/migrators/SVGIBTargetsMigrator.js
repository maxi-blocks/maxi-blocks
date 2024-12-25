import { getSVGStyles } from '@extensions/styles/helpers/getSVGStyles';
import { merge } from 'lodash';

const name = 'IB SVG Icon Target';

// Copied from src/components/relation-control/index.js
const getStyles = (stylesObj, isFirst = false) => {
	// Using basic breakpoints as they can't be changed yet
	const breakpoints = {
		xs: 480,
		s: 767,
		m: 1024,
		l: 1366,
		xl: 1920,
	};

	if (Object.keys(stylesObj).some(key => key.includes('general'))) {
		const styles = Object.keys(stylesObj).reduce((acc, key) => {
			if (breakpoints[key] || key === 'xxl' || key === 'general') {
				acc[key] = {
					styles: stylesObj[key],
					breakpoint: breakpoints[key] || null,
				};

				return acc;
			}

			return acc;
		}, {});

		return styles;
	}

	const styles = Object.keys(stylesObj).reduce((acc, key) => {
		if (isFirst) {
			if (!key.includes(':hover')) acc[key] = getStyles(stylesObj[key]);

			return acc;
		}

		const newAcc = merge(acc, getStyles(stylesObj[key]));

		return newAcc;
	}, {});

	return styles;
};

const isEligible = blockAttributes =>
	!!blockAttributes?.relations &&
	blockAttributes.relations.some(
		relation =>
			relation.uniqueID &&
			relation.uniqueID.includes('svg-icon-maxi') &&
			relation.settings === 'Icon colour' &&
			!Object.keys(relation.css).some(
				target =>
					target.includes('svg[data-fill]:not([fill^="none"]) *') ||
					target.includes('svg[data-stroke]:not([stroke^="none"]) *')
			)
	);

const migrate = newAttributes => {
	const { relations } = newAttributes;

	relations.forEach((relation, i) => {
		if (relation.uniqueID.includes('svg-icon-maxi')) {
			const styles = getSVGStyles({
				obj: relation.attributes,
				target: ' .maxi-svg-icon-block__icon',
				prefix: 'svg-',
				blockStyle: newAttributes.blockStyle,
			});

			relations[i].css = getStyles(styles, true);
		}
	});

	return { ...newAttributes, relations };
};

export default { name, isEligible, migrate };

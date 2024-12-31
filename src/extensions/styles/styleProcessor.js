/**
 * Internal dependencies
 */
import { getSelectorsCss } from '@components/custom-css-control/utils';
import { getTransformSelectors } from '@components/transform-control/utils';
import {
	getCustomCssObject,
	getAdvancedCssObject,
	getTransformStyles,
	getTransitionStyles,
} from './helpers';
import styleCleaner from './styleCleaner';
import getTransformTransitionData from './transitions/getTransformTransitionData';
import transitionDefault from './transitions/transitionDefault';

/**
 * External dependencies
 */
import { cloneDeep, isEmpty, isString, merge, mergeWith } from 'lodash';

const styleProcessor = (obj, data, props) => {
	const selectors = data?.customCss?.selectors;
	const transitionSelectors = {
		...(data?.transition || transitionDefault),
		transform: getTransformTransitionData(selectors, props),
	};

	const styles = cloneDeep(obj);

	const transitionObject = getTransitionStyles(props, transitionSelectors);
	if (!isEmpty(transitionObject)) {
		const isTransitionString = string => {
			if (!isString(string)) return false;

			const propertyName = '\\w+(-\\w+)*';
			const duration = '\\d+(\\.\\d+)?(s|ms)';
			const delay = '(\\s+\\d+(\\.\\d+)?(s|ms))?';
			const timingFunction = '(\\s+\\w+(-\\w+)*((.*))?)?';
			const transitionPattern = `(${propertyName}\\s+${duration}${delay}${timingFunction})`;

			// Allowing multiple transitions separated by commas.
			const regex = new RegExp(
				`^${transitionPattern}(,\\s*${transitionPattern})*$`
			);

			return regex.test(string);
		};

		/**
		 * Merge `image-maxi` hover effect transition with transition setting styles.
		 */
		if (isString(props['hover-type']) && props['hover-type'] !== 'none') {
			// eslint-disable-next-line consistent-return
			mergeWith(styles, transitionObject, (objValue, srcValue) => {
				if ([objValue, srcValue].every(isTransitionString))
					return `${objValue}, ${srcValue}`;
			});
		} else {
			merge(styles, transitionObject);
		}
	}

	// Process custom styles if they exist
	const newCssSelectors = getSelectorsCss(selectors, props);
	const newTransformSelectors = getTransformSelectors(selectors, props, true);

	const advancedCssObject = getAdvancedCssObject(props);
	if (!isEmpty(advancedCssObject)) merge(styles, advancedCssObject);

	if (!isEmpty(newCssSelectors)) {
		const customCssObject = getCustomCssObject(newCssSelectors, props);
		!isEmpty(customCssObject) && merge(styles, customCssObject);
	}
	if (!isEmpty(newTransformSelectors)) {
		const transformObject = getTransformStyles(
			props,
			newTransformSelectors,
			true
		);

		if (!isEmpty(transformObject)) {
			const isTransformString = string =>
				isString(string) &&
				['rotate', 'scale', 'translate'].some(word =>
					string.includes(word)
				);

			// eslint-disable-next-line consistent-return
			mergeWith(styles, transformObject, (objValue, srcValue) => {
				if ([objValue, srcValue].every(isTransformString))
					return `${objValue} ${srcValue}`;
			});
		}
	}
	return styleCleaner(styles);
};

export default styleProcessor;

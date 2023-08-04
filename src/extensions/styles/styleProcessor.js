/**
 * Internal dependencies
 */
import { getSelectorsCss } from '../../components/custom-css-control/utils';
import { getTransformSelectors } from '../../components/transform-control/utils';
import {
	getCustomCssObject,
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
	if (!isEmpty(transitionObject)) merge(styles, transitionObject);

	// Process custom styles if they exist
	const newCssSelectors = getSelectorsCss(selectors, props);
	const newTransformSelectors = getTransformSelectors(selectors, props);

	if (!isEmpty(newCssSelectors)) {
		const customCssObject = getCustomCssObject(newCssSelectors, props);
		!isEmpty(customCssObject) && merge(styles, customCssObject);
	}
	if (!isEmpty(newTransformSelectors)) {
		const transformObject = getTransformStyles(
			props,
			newTransformSelectors
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

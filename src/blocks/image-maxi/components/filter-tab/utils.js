/**
 * Internal dependencies
 */
import { getLastBreakpointAttribute } from '@extensions/styles';
import {
	FILTER_BREAKPOINTS,
	IMAGE_FILTER_CONTROLS,
	IMAGE_FILTER_DROP_SHADOW_COLOR_DEFAULT,
	IMAGE_FILTER_DROP_SHADOW_CONTROLS,
	getDropShadowAttribute,
	getFilterAttribute,
} from './constants';

/**
 * External dependencies
 */
import { isNil, isNumber } from 'lodash';

const hasOwn = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);

const getNumber = value => {
	if (isNumber(value)) return value;
	if (value === '' || isNil(value)) return undefined;

	const parsed = Number(value);

	return Number.isNaN(parsed) ? undefined : parsed;
};

const getFilterNumber = (props, target, breakpoint) =>
	getNumber(
		getLastBreakpointAttribute({
			target,
			breakpoint,
			attributes: props,
		})
	);

const hasExplicitBreakpointValue = (props, target, breakpoint) =>
	hasOwn(props, `${target}-${breakpoint}`) &&
	!isNil(props[`${target}-${breakpoint}`]) &&
	props[`${target}-${breakpoint}`] !== '';

const hasExplicitFilterValue = (props, breakpoint) =>
	IMAGE_FILTER_CONTROLS.some(({ key }) =>
		hasExplicitBreakpointValue(props, getFilterAttribute(key), breakpoint)
	) ||
	IMAGE_FILTER_DROP_SHADOW_CONTROLS.some(({ key }) =>
		hasExplicitBreakpointValue(
			props,
			getDropShadowAttribute(key),
			breakpoint
		)
	) ||
	hasExplicitBreakpointValue(
		props,
		getDropShadowAttribute('color'),
		breakpoint
	);

export const getImageFilterValue = (props, breakpoint) => {
	const filterFunctions = IMAGE_FILTER_CONTROLS.reduce(
		(acc, { key, cssFunction, unit, defaultValue }) => {
			const value = getFilterNumber(
				props,
				getFilterAttribute(key),
				breakpoint
			);

			if (!isNil(value) && value !== defaultValue) {
				acc.push(`${cssFunction}(${value}${unit})`);
			}

			return acc;
		},
		[]
	);

	const dropShadowValues = IMAGE_FILTER_DROP_SHADOW_CONTROLS.reduce(
		(acc, { key, defaultValue }) => {
			const value = getFilterNumber(
				props,
				getDropShadowAttribute(key),
				breakpoint
			);

			acc[key] = isNil(value) ? defaultValue : value;

			return acc;
		},
		{}
	);
	const hasDropShadow = IMAGE_FILTER_DROP_SHADOW_CONTROLS.some(
		({ key, defaultValue }) => dropShadowValues[key] !== defaultValue
	);

	if (hasDropShadow) {
		const color =
			getLastBreakpointAttribute({
				target: getDropShadowAttribute('color'),
				breakpoint,
				attributes: props,
			}) || IMAGE_FILTER_DROP_SHADOW_COLOR_DEFAULT;

		filterFunctions.push(
			`drop-shadow(${dropShadowValues.horizontal}px ${dropShadowValues.vertical}px ${dropShadowValues.blur}px ${color})`
		);
	}

	return filterFunctions.join(' ');
};

export const getImageFilterStyles = props => {
	const response = {};

	FILTER_BREAKPOINTS.forEach(breakpoint => {
		const filter = getImageFilterValue(props, breakpoint);

		if (breakpoint === 'general') {
			if (filter) response[breakpoint] = { filter };
			return;
		}

		if (hasExplicitFilterValue(props, breakpoint)) {
			response[breakpoint] = { filter: filter || 'none' };
		}
	});

	return Object.keys(response).length ? { filter: response } : {};
};

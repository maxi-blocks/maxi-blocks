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

const getFilterNumber = (props, target, breakpoint, isHover = false) =>
	getNumber(
		getLastBreakpointAttribute({
			target,
			breakpoint,
			attributes: props,
			isHover,
		})
	);

const getStateAttributeKey = (target, breakpoint, isHover = false) =>
	`${target}-${breakpoint}${isHover ? '-hover' : ''}`;

const hasExplicitBreakpointValue = (
	props,
	target,
	breakpoint,
	isHover = false
) => {
	const key = getStateAttributeKey(target, breakpoint, isHover);

	return hasOwn(props, key) && !isNil(props[key]) && props[key] !== '';
};

const hasExplicitFilterValue = (props, breakpoint, isHover = false) =>
	IMAGE_FILTER_CONTROLS.some(({ key }) =>
		hasExplicitBreakpointValue(
			props,
			getFilterAttribute(key),
			breakpoint,
			isHover
		)
	) ||
	IMAGE_FILTER_DROP_SHADOW_CONTROLS.some(({ key }) =>
		hasExplicitBreakpointValue(
			props,
			getDropShadowAttribute(key),
			breakpoint,
			isHover
		)
	) ||
	hasExplicitBreakpointValue(
		props,
		getDropShadowAttribute('color'),
		breakpoint,
		isHover
	);

export const getImageFilterValue = (props, breakpoint, isHover = false) => {
	const filterFunctions = IMAGE_FILTER_CONTROLS.reduce(
		(acc, { key, cssFunction, unit, defaultValue }) => {
			const value = getFilterNumber(
				props,
				getFilterAttribute(key),
				breakpoint,
				isHover
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
				breakpoint,
				isHover
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
				isHover,
			}) || IMAGE_FILTER_DROP_SHADOW_COLOR_DEFAULT;

		filterFunctions.push(
			`drop-shadow(${dropShadowValues.horizontal}px ${dropShadowValues.vertical}px ${dropShadowValues.blur}px ${color})`
		);
	}

	return filterFunctions.join(' ');
};

export const getImageFilterStyles = (props, isHover = false) => {
	const response = {};

	FILTER_BREAKPOINTS.forEach(breakpoint => {
		const filter = getImageFilterValue(props, breakpoint, isHover);
		const hasExplicitValue = hasExplicitFilterValue(
			props,
			breakpoint,
			isHover
		);

		if (breakpoint === 'general') {
			if (filter || (isHover && hasExplicitValue)) {
				response[breakpoint] = { filter: filter || 'none' };
			}
			return;
		}

		if (hasExplicitValue) {
			response[breakpoint] = { filter: filter || 'none' };
		}
	});

	return Object.keys(response).length ? { filter: response } : {};
};

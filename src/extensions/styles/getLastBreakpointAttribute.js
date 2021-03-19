/**
 * WordPress dependencies
 */
const { select } = wp.data;

/**
 * External dependencies
 */
import { isNil, isEmpty, isBoolean, isNumber } from 'lodash';
import getStyleCardAttr from './defaults/style-card';

/**
 * Breakpoints
 */
const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

/**
 * Gets an object base on Maxi Blocks breakpoints schema and looks for the last set value
 * for a concrete property in case is not set for the requested breakpoint
 */
const getLastBreakpointAttribute = (
	target,
	breakpoint,
	attributes = null,
	isHover = false
) => {
	const { getBlockAttributes, getSelectedBlockClientId } = select(
		'core/block-editor'
	);

	const attr = attributes || getBlockAttributes(getSelectedBlockClientId());

	const getBlockStyleAttribute = () => {
		const { getBlockAttributes, getBlockParents } = select(
			'core/block-editor'
		);
		const { blockStyle } = attr;

		switch (blockStyle) {
			case 'maxi-light':
				return 'light';
			case 'maxi-dark':
				return 'dark';
			case 'maxi-parent': {
				return getBlockAttributes(
					getBlockParents(getSelectedBlockClientId)[0]
				).blockStyle.replace('maxi-', '');
			}
			default:
				return 'light';
		}
	};

	let currentAttr;

	if (!isNil(attr)) {
		currentAttr = attr[`${target}-${breakpoint}${isHover ? '-hover' : ''}`];

		if (currentAttr === 'styleCard') {
			if (target === 'font-family') {
				currentAttr = getStyleCardAttr(
					'p-font-family',
					getBlockStyleAttribute(),
					false
				);
			}
		}

		if (
			!isNil(currentAttr) &&
			(isNumber(currentAttr) ||
				isBoolean(currentAttr) ||
				!isEmpty(currentAttr))
		)
			return currentAttr;

		let breakpointPosition = breakpoints.indexOf(breakpoint);

		do {
			breakpointPosition -= 1;
			currentAttr =
				attr[
					`${target}-${breakpoints[breakpointPosition]}${
						isHover ? '-hover' : ''
					}`
				];
		} while (
			breakpointPosition > 0 &&
			!isNumber(currentAttr) &&
			(isEmpty(currentAttr) || isNil(currentAttr))
		);

		return currentAttr;
	}
	return false;
};

export default getLastBreakpointAttribute;

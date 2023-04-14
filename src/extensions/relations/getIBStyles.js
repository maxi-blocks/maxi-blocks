/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { getGroupAttributes } from '../styles';

/**
 * External dependencies
 */
import { merge } from 'lodash';

const getIBStyles = ({ stylesObj = {}, blockAttributes, isFirst = false }) => {
	const { receiveMaxiBreakpoints, receiveXXLSize } = select('maxiBlocks');

	const storeBreakpoints = receiveMaxiBreakpoints();
	const blockBreakpoints = getGroupAttributes(blockAttributes, 'breakpoints');

	const breakpoints = {
		...storeBreakpoints,
		xxl: receiveXXLSize(),
		...Object.keys(blockBreakpoints).reduce((acc, key) => {
			if (blockAttributes[key]) {
				const newKey = key.replace('breakpoints-', '');
				acc[newKey] = blockBreakpoints[key];
			}
			return acc;
		}, {}),
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
			if (!key.includes(':hover'))
				acc[key] = getIBStyles({
					stylesObj: stylesObj[key],
					blockAttributes,
				});

			return acc;
		}

		const newAcc = merge(
			acc,
			getIBStyles({ stylesObj: stylesObj[key], blockAttributes })
		);

		return newAcc;
	}, {});

	return styles;
};

export default getIBStyles;

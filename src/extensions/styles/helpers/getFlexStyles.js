/**
 * External dependencies
 */
import { isNil, isEmpty } from 'lodash';
/**
 * Internal dependencies
 */
import getLastBreakpointAttribute from '../../attributes/getLastBreakpointAttribute';

const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

/**
 * Generates flex styles object
 */
const getFlexStyles = obj => {
	const response = {};
	breakpoints.forEach(breakpoint => {
		let flexBasis = getLastBreakpointAttribute({
			target: '_fb',
			breakpoint,
			attributes: obj,
		});
		if (
			flexBasis &&
			!['content', 'max-content', 'min-content', 'fit-content'].includes(
				flexBasis
			)
		) {
			flexBasis = `${flexBasis}${getLastBreakpointAttribute({
				target: '_fb.u',
				breakpoint,
				attributes: obj,
			})}`;
		}

		const [
			flexGrow,
			flexShrink,
			flexWrap,
			flexOrder,
			justifyContent,
			flexDirection,
			alignItems,
			alignContent,
			rowGapProps,
			columnGap,
		] = getLastBreakpointAttribute({
			target: [
				'_fg',
				'_fls',
				'_flw',
				'_or',
				'_jc',
				'_fd',
				'_ai',
				'_ac',
				'_rg',
				'_cg',
			],
			breakpoint,
			attributes: obj,
		});

		response[breakpoint] = {
			...((flexBasis || flexGrow || flexShrink) && {
				flex: `${flexGrow || 0} ${flexShrink || 1} ${
					flexBasis || 'auto'
				}`,
			}),
			...(!isNil(flexWrap) && {
				'flex-wrap': flexWrap,
			}),
			...(!isNil(flexOrder) && {
				order: flexOrder,
			}),
			...(!isNil(justifyContent) && {
				'justify-content': justifyContent,
			}),
			...(!isNil(flexDirection) && {
				'flex-direction': flexDirection,
			}),
			...(!isNil(alignItems) && {
				'align-items': alignItems,
			}),
			...(!isNil(alignContent) && {
				'align-content': alignContent,
			}),
			...(!isNil(rowGapProps) && {
				'row-gap': `${rowGapProps}${getLastBreakpointAttribute({
					target: '_rg.u',
					breakpoint,
					attributes: obj,
				})}`,
			}),
			...(!isNil(columnGap) && {
				'column-gap': `${columnGap}${getLastBreakpointAttribute({
					target: '_cg.u',
					breakpoint,
					attributes: obj,
				})}`,
			}),
		};

		if (isEmpty(response[breakpoint])) delete response[breakpoint];
	});

	return response;
};

export default getFlexStyles;

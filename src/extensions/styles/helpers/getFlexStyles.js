/**
 * External dependencies
 */
import { isNil, isEmpty } from 'lodash';
/**
 * Internal dependencies
 */
import getLastBreakpointAttribute from '@extensions/styles/getLastBreakpointAttribute';

const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

/**
 * Generates flex styles object
 */
const getFlexStyles = (obj, prefix = '') => {
	const response = {};
	breakpoints.forEach(breakpoint => {
		let flexBasis = getLastBreakpointAttribute({
			target: `${prefix}flex-basis`,
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
				target: `${prefix}flex-basis-unit`,
				breakpoint,
				attributes: obj,
			})}`;
		}

		const flexGrow = getLastBreakpointAttribute({
			target: `${prefix}flex-grow`,
			breakpoint,
			attributes: obj,
		});

		const flexShrink = getLastBreakpointAttribute({
			target: `${prefix}flex-shrink`,
			breakpoint,
			attributes: obj,
		});
		const flexWrap = getLastBreakpointAttribute({
			target: `${prefix}flex-wrap`,
			breakpoint,
			attributes: obj,
		});
		const flexOrder = getLastBreakpointAttribute({
			target: `${prefix}order`,
			breakpoint,
			attributes: obj,
		});
		const justifyContent = getLastBreakpointAttribute({
			target: `${prefix}justify-content`,
			breakpoint,
			attributes: obj,
		});
		const flexDirection = getLastBreakpointAttribute({
			target: `${prefix}flex-direction`,
			breakpoint,
			attributes: obj,
		});
		const alignItems = getLastBreakpointAttribute({
			target: `${prefix}align-items`,
			breakpoint,
			attributes: obj,
		});
		const alignContent = getLastBreakpointAttribute({
			target: `${prefix}align-content`,
			breakpoint,
			attributes: obj,
		});
		const rowGapProps = getLastBreakpointAttribute({
			target: `${prefix}row-gap`,
			breakpoint,
			attributes: obj,
		});

		const columnGap = getLastBreakpointAttribute({
			target: `${prefix}column-gap`,
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
					target: `${prefix}row-gap-unit`,
					breakpoint,
					attributes: obj,
				})}`,
			}),
			...(!isNil(columnGap) && {
				'column-gap': `${columnGap}${getLastBreakpointAttribute({
					target: `${prefix}column-gap-unit`,
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

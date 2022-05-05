/**
 * External dependencies
 */
import { isNil, isEmpty } from 'lodash';
/**
 * Internal dependencies
 */
import getLastBreakpointAttribute from '../getLastBreakpointAttribute';

const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

/**
 * Generates flex styles object
 */
const getFlexStyles = obj => {
	const response = {};
	breakpoints.forEach(breakpoint => {
		let flexBasis = getLastBreakpointAttribute({
			target: 'flex-basis',
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
				target: 'flex-basis-unit',
				breakpoint,
				attributes: obj,
			})}`;
		}

		const flexGrow = getLastBreakpointAttribute({
			target: 'flex-grow',
			breakpoint,
			attributes: obj,
		});

		const flexShrink = getLastBreakpointAttribute({
			target: 'flex-shrink',
			breakpoint,
			attributes: obj,
		});
		const flexWrap = getLastBreakpointAttribute({
			target: 'flex-wrap',
			breakpoint,
			attributes: obj,
		});
		const flexFlow = getLastBreakpointAttribute({
			target: 'flex-flow',
			breakpoint,
			attributes: obj,
		});
		const flexOrder = getLastBreakpointAttribute({
			target: 'order',
			breakpoint,
			attributes: obj,
		});
		const justifyContent = getLastBreakpointAttribute({
			target: 'justify-content',
			breakpoint,
			attributes: obj,
		});
		const flexDirection = getLastBreakpointAttribute({
			target: 'flex-direction',
			breakpoint,
			attributes: obj,
		});
		const alignItems = getLastBreakpointAttribute({
			target: 'align-items',
			breakpoint,
			attributes: obj,
		});
		const alignContent = getLastBreakpointAttribute({
			target: 'align-content',
			breakpoint,
			attributes: obj,
		});
		const rowGapProps = getLastBreakpointAttribute({
			target: 'row-gap',
			breakpoint,
			attributes: obj,
		});
		const columnGap = getLastBreakpointAttribute({
			target: 'column-gap',
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
			...(!isNil(flexFlow) && {
				'flex-flow': flexFlow,
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
					target: 'row-gap-unit',
					breakpoint,
					attributes: obj,
				})}`,
			}),
			...(!isNil(columnGap) && {
				'column-gap': `${columnGap}${getLastBreakpointAttribute({
					target: 'column-gap-unit',
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

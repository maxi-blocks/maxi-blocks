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

		const {
			'flex-grow': flexGrow,
			'flex-shrink': flexShrink,
			'flex-wrap': flexWrap,
			order: flexOrder,
			'justify-content': justifyContent,
			'flex-direction': flexDirection,
			'align-items': alignItems,
			'align-content': alignContent,
			'row-gap': rowGapProps,
			'column-gap': columnGap,
		} = getLastBreakpointAttribute({
			target: [
				'flex-grow',
				'flex-shrink',
				'flex-wrap',
				'order',
				'justify-content',
				'flex-direction',
				'align-items',
				'align-content',
				'row-gap',
				'column-gap',
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

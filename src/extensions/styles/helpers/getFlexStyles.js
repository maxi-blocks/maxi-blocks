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
		let flexBasis = '';

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

		if (
			['content', 'max-content', 'min-content', 'fit-content'].includes(
				getLastBreakpointAttribute({
					target: 'flex-basis',
					breakpoint,
					attributes: obj,
				})
			)
		) {
			flexBasis = getLastBreakpointAttribute({
				target: 'flex-basis',
				breakpoint,
				attributes: obj,
			});
		} else if (
			getLastBreakpointAttribute({
				target: 'flex-basis',
				breakpoint,
				attributes: obj,
			}) &&
			getLastBreakpointAttribute({
				target: 'flex-basis-unit',
				breakpoint,
				attributes: obj,
			})
		) {
			flexBasis = `${getLastBreakpointAttribute({
				target: 'flex-basis',
				breakpoint,
				attributes: obj,
			})}${getLastBreakpointAttribute({
				target: 'flex-basis-unit',
				breakpoint,
				attributes: obj,
			})}`;
		}

		response[breakpoint] = {
			...((flexBasis || flexGrow || flexShrink) && {
				flex: `${flexGrow || 0} ${flexShrink || 1} ${
					flexBasis || 'auto'
				}`,
			}),
			...(!isNil(
				getLastBreakpointAttribute({
					target: 'flex-wrap',
					breakpoint,
					attributes: obj,
				})
			) && {
				'flex-wrap': getLastBreakpointAttribute({
					target: 'flex-wrap',
					breakpoint,
					attributes: obj,
				}),
			}),
			...(!isNil(
				getLastBreakpointAttribute({
					target: 'flex-flow',
					breakpoint,
					attributes: obj,
				})
			) && {
				'flex-flow': getLastBreakpointAttribute({
					target: 'flex-flow',
					breakpoint,
					attributes: obj,
				}),
			}),
			...(!isNil(
				getLastBreakpointAttribute({
					target: 'order',
					breakpoint,
					attributes: obj,
				})
			) && {
				order: getLastBreakpointAttribute({
					target: 'order',
					breakpoint,
					attributes: obj,
				}),
			}),
			...(!isNil(
				getLastBreakpointAttribute({
					target: 'justify-content',
					breakpoint,
					attributes: obj,
				})
			) && {
				'justify-content': getLastBreakpointAttribute({
					target: 'justify-content',
					breakpoint,
					attributes: obj,
				}),
			}),
			...(!isNil(
				getLastBreakpointAttribute({
					target: 'flex-direction',
					breakpoint,
					attributes: obj,
				})
			) && {
				'flex-direction': getLastBreakpointAttribute({
					target: 'flex-direction',
					breakpoint,
					attributes: obj,
				}),
			}),
			...(!isNil(
				getLastBreakpointAttribute({
					target: 'align-items',
					breakpoint,
					attributes: obj,
				})
			) && {
				'align-items': getLastBreakpointAttribute({
					target: 'align-items',
					breakpoint,
					attributes: obj,
				}),
			}),
			...(!isNil(
				getLastBreakpointAttribute({
					target: 'align-content',
					breakpoint,
					attributes: obj,
				})
			) && {
				'align-content': getLastBreakpointAttribute({
					target: 'align-content',
					breakpoint,
					attributes: obj,
				}),
			}),
			...(!isNil(
				getLastBreakpointAttribute({
					target: 'row-gap',
					breakpoint,
					attributes: obj,
				})
			) && {
				'row-gap': `${getLastBreakpointAttribute({
					target: 'row-gap',
					breakpoint,
					attributes: obj,
				})}${getLastBreakpointAttribute({
					target: 'row-gap-unit',
					breakpoint,
					attributes: obj,
				})}`,
			}),
			...(!isNil(
				getLastBreakpointAttribute({
					target: 'column-gap',
					breakpoint,
					attributes: obj,
				})
			) && {
				'column-gap': `${getLastBreakpointAttribute({
					target: 'column-gap',
					breakpoint,
					attributes: obj,
				})}${getLastBreakpointAttribute({
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

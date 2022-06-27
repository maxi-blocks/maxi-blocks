/**
 * External dependencies
 */
import { isNil, isEmpty } from 'lodash';
/**
 * Internal dependencies
 */
import getLastBreakpointAttribute from '../getLastBreakpointAttribute';
import flex from '../defaults/flex';

const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

/**
 * Generates flex styles object
 */
const getFlexStyles = obj => {
	const response = {};

	const getFlexAttribute = (
		attribute,
		breakpoint,
		obj,
		selectLast = false
	) => {
		const defaultAttribute = flex[`${attribute}-${breakpoint}`].default;
		const currentAttribute = !selectLast
			? obj[`${attribute}-${breakpoint}`]
			: getLastBreakpointAttribute({
					target: attribute,
					breakpoint,
					attributes: obj,
			  });

		if (defaultAttribute !== currentAttribute) {
			return currentAttribute;
		}

		return null;
	};

	breakpoints.forEach(breakpoint => {
		let flexBasis = getLastBreakpointAttribute({
			target: 'flex-basis',
			breakpoint,
			attributes: obj,
		});

		if (
			flexBasis &&
			![
				'unset',
				'content',
				'max-content',
				'min-content',
				'fit-content',
			].includes(flexBasis)
		) {
			flexBasis = `${flexBasis}${getLastBreakpointAttribute({
				target: 'flex-basis-unit',
				breakpoint,
				attributes: obj,
			})}`;
		}

		const flexGrow = getFlexAttribute('flex-grow', breakpoint, obj, true);

		const flexShrink = getFlexAttribute(
			'flex-shrink',
			breakpoint,
			obj,
			true
		);
		const flexWrap = getFlexAttribute('flex-wrap', breakpoint, obj);

		const flexFlow = getFlexAttribute('flex-flow', breakpoint, obj);
		const flexOrder = getFlexAttribute('order', breakpoint, obj);
		const justifyContent = getFlexAttribute(
			'justify-content',
			breakpoint,
			obj
		);

		const flexDirection = getFlexAttribute(
			'flex-direction',
			breakpoint,
			obj
		);
		const alignItems = getFlexAttribute('align-items', breakpoint, obj);

		const alignContent = getFlexAttribute('align-content', breakpoint, obj);
		const rowGapProps = getFlexAttribute('row-gap', breakpoint, obj);

		const columnGap = getFlexAttribute('column-gap', breakpoint, obj);

		response[breakpoint] = {
			...((flexBasis !== 'unset' || flexGrow || flexShrink) && {
				flex: `${flexGrow || 0} ${flexShrink || 1} ${
					flexBasis !== 'unset' ? flexBasis : 'auto'
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

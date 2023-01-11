/**
 * Internal dependencies
 */
import getAttributeValue from '../getAttributeValue';
import getLastBreakpointAttribute from '../getLastBreakpointAttribute';

// Sets text decoration to the link if the whole text is a link, otherwise sets it to the text.
// See issue #3832 for context.
const getTextDecorationStyles = ({
	obj,
	prefix = '',
	isHover = false,
	isLink = false,
}) => {
	const response = {};

	['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'].forEach(breakpoint => {
		response[breakpoint] = {};
		const isWholeLink = getLastBreakpointAttribute({
			target: 'is-whole-link',
			breakpoint,
			attributes: obj,
		});

		// Both true or both false
		if (!!isWholeLink === !!isLink) {
			const hoverStatus = getAttributeValue({
				target: 'typography-status-hover',
				prefix,
				props: obj,
			});
			const value = getAttributeValue({
				target: 'text-decoration',
				breakpoint,
				isHover,
				prefix,
				props: obj,
			});
			if (value && (hoverStatus || !isHover))
				response[breakpoint]['text-decoration'] = value;
		}
	});

	return response;
};

export default getTextDecorationStyles;

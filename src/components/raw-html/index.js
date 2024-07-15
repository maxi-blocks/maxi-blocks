/**
 * WordPress dependencies
 */
import { forwardRef } from '@wordpress/element';

/**
 * External dependencies
 */
import DOMPurify from 'dompurify';
import parse from 'html-react-parser';

const getNodeOnDOM = props => {
	const { nodeType, className, dataItem } = props;

	const classes =
		className?.split(' ').reduce((string, newClass, i) => {
			if (i) return `.${string}.${newClass}`;
			return `${string}.${newClass}`;
		}) || '';
	const dataSelector = (dataItem && `[data-item="${dataItem}"]`) || '';

	const DOMNode = document.querySelector(
		`${nodeType}${classes}${dataSelector}`
	);

	return DOMNode;
};

const RawHTML = forwardRef((props, ref) => {
	const { children } = props;

	if (!children) return null;

	const cleanedChildren = DOMPurify.sanitize(children, {
		ADD_TAGS: ['use'],
	});

	const parsedContent = parse(cleanedChildren);

	if (typeof parsedContent === 'string') {
		return parsedContent;
	}

	if (Array.isArray(parsedContent)) {
		// Map over the array and process each element
		return parsedContent.map((content, index) => {
			const {
				type: nodeType,
				props: { 'data-item': dataItem, className },
			} = content;

			const refTarget = getNodeOnDOM({ nodeType, className, dataItem });

			// Pass the ref to the first element only
			if (ref && refTarget && index === 0) ref(refTarget);

			return content;
		});
	}
});

export default RawHTML;

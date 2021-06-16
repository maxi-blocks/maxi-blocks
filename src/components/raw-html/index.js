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

	const cleanedChildren = DOMPurify.sanitize(children);

	const parsedContent = parse(cleanedChildren);

	const {
		type: nodeType,
		props: { 'data-item': dataItem, className },
	} = parsedContent;

	const refTarget = getNodeOnDOM({ nodeType, className, dataItem });

	if (ref && refTarget) ref.current = refTarget;

	return parsedContent;
});

export default RawHTML;

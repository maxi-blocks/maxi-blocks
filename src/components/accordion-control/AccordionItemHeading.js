/**
 * WordPress dependencies
 */
import { useRef } from '@wordpress/element';

const AccordionItemHeading = props => {
	const { children, className } = props;

	const headingRef = useRef();

	return (
		<div
			className={className}
			ref={headingRef}
			data-accordion-component='AccordionItemHeading'
		>
			{children}
		</div>
	);
};

export default AccordionItemHeading;

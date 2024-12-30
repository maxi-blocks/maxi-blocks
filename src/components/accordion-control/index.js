/**
 * Internal dependencies
 */
import Accordion from './Accordion';
import { getActiveAccordion } from '@extensions/inspector';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Styles
 */
import './editor.scss';

/**
 * Component
 */
const AccordionControl = props => {
	const {
		className,
		isPrimary = false,
		isSecondary = false,
		depth,
		isNestedAccordion = false,
	} = props;

	const classes = classnames(
		'maxi-accordion-control',
		className,
		isPrimary && 'is-primary',
		isSecondary && 'is-secondary',
		isNestedAccordion && 'maxi-accordion-control--nested',
		'moremargin' // Added class
	);

	const preExpandedAccordion = getActiveAccordion(1);

	return (
		<Accordion
			className={classes}
			preExpanded={preExpandedAccordion}
			{...props}
			depth={depth}
		/>
	);
};

export default AccordionControl;

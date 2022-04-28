/**
 * Internal dependencies
 */
import Accordion from './Accordion';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Styles
 */
import './editor.scss';
import { getActiveAccordion } from '../../extensions/inspector-path';

/**
 * Component
 */
const AccordionControl = props => {
	const { className, isPrimary = false, isSecondary = false } = props;

	const classes = classnames(
		'maxi-accordion-control',
		className,
		isPrimary && 'is-primary',
		isSecondary && 'is-secondary'
	);

	const preExpandedAccordion = getActiveAccordion(1);

	return (
		<Accordion
			className={classes}
			preExpanded={preExpandedAccordion}
			{...props}
		/>
	);
};

export default AccordionControl;

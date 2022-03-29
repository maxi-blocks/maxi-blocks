/**
 * WordPress dependencies
 */
import { useDispatch } from '@wordpress/data';

/**
 * Internal dependencies
 */
import Icon from '../icon';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { lowerCase } from 'lodash';
import {
	Accordion,
	AccordionItem,
	AccordionItemHeading,
	AccordionItemButton,
	AccordionItemPanel,
} from 'react-accessible-accordion';

import { getActiveAccordion } from '../../extensions/inspector-path';

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
		allowMultipleExpanded = false,
		allowZeroExpanded = true,
		items,
		isPrimary = false,
		isSecondary = false,
		disablePadding = false,
	} = props;

	const { updateInspectorPath } = useDispatch('maxiBlocks');

	const classes = classnames(
		'maxi-accordion-control',
		className,
		isPrimary && 'is-primary',
		isSecondary && 'is-secondary'
	);

	const currentAccordion = getActiveAccordion(1);

	const accordionChange = accordionId => {
		updateInspectorPath({ depth: 1, value: accordionId[0] });
	};

	return (
		<Accordion
			className={classes}
			allowMultipleExpanded={allowMultipleExpanded}
			allowZeroExpanded={allowZeroExpanded}
			preExpanded={[currentAccordion]}
			onChange={value => accordionChange(value)}
		>
			{items.map((item, id) => {
				if (!item) return null;

				const classesItem = classnames(
					'maxi-accordion-control__item',
					item.classNameItem
				);
				const classesItemHeading = classnames(
					'maxi-accordion-tab',
					item.classNameHeading
				);

				const classesItemPanel = classnames(
					'maxi-accordion-control__item__panel',
					disablePadding || item.disablePadding
						? 'maxi-accordion-control__item__panel--disable-padding'
						: ''
				);

				const accordionUid =
					lowerCase(item.label).replace(/[^a-zA-Z0-9]+/g, '') ||
					undefined;

				return (
					<AccordionItem
						uuid={accordionUid}
						className={classesItem}
						data-name={lowerCase(item.label)}
						key={`maxi-accordion-control__item-${id}`}
					>
						<AccordionItemHeading className={classesItemHeading}>
							<AccordionItemButton className='maxi-accordion-control__item__button'>
								<Icon
									className='maxi-accordion-icon'
									icon={item.icon}
								/>
								{item.label}
							</AccordionItemButton>
						</AccordionItemHeading>
						<AccordionItemPanel className={classesItemPanel}>
							{item.content}
						</AccordionItemPanel>
					</AccordionItem>
				);
			})}
		</Accordion>
	);
};

export default AccordionControl;

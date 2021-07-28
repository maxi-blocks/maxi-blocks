/**
 * WordPress dependencies
 */
import { useState } from '@wordpress/element';

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

	const classes = classnames(
		'maxi-accordion-control',
		className,
		isPrimary && 'is-primary',
		isSecondary && 'is-secondary'
	);

	const [currentOpen, setCurrentOpen] = useState('');

	return (
		<Accordion
			className={classes}
			allowMultipleExpanded={allowMultipleExpanded}
			allowZeroExpanded={allowZeroExpanded}
			preExpanded={currentOpen}
			onChange={value => setCurrentOpen(value)}
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

				return (
					<AccordionItem
						uuid={item.uuid ? item.uuid : undefined}
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

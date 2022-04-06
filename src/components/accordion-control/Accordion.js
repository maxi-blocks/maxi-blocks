/**
 * WordPress dependencies
 */
import { select, useDispatch, useSelect } from '@wordpress/data';
import { useEffect, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import AccordionItem from './AccordionItem';

/**
 * External dependencies
 */
import { lowerCase } from 'lodash';
import classnames from 'classnames';

const Accordion = props => {
	const {
		className,
		items,
		disablePadding = false,
		preExpandedAccordion,
	} = props;

	const [itemExpanded, setItemExpanded] = useState(preExpandedAccordion);

	const { updateInspectorPath } = useDispatch('maxiBlocks');

	const updatedItemExpanded = useSelect(
		() => select('maxiBlocks').receiveInspectorPath()?.[1]?.value
	);

	const toggleExpanded = uuid => {
		updateInspectorPath({ depth: 1, value: uuid });
		setItemExpanded(uuid);
	};

	useEffect(() => {
		if (updatedItemExpanded !== itemExpanded) {
			setItemExpanded(updatedItemExpanded);
		}
	}, [updatedItemExpanded]);

	return (
		<div className={className} data-accordion-component='Accordion'>
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

				const isExpanded = accordionUid === itemExpanded;

				return (
					<AccordionItem
						uuid={accordionUid}
						className={classesItem}
						data-name={lowerCase(item.label)}
						key={`maxi-accordion-control__item-${id}`}
						isExpanded={isExpanded}
						label={item.label}
						icon={item.icon}
						content={item.content}
						headingClassName={classesItemHeading}
						panelClassName={classesItemPanel}
						toggleExpanded={toggleExpanded}
					/>
				);
			})}
		</div>
	);
};

export default Accordion;

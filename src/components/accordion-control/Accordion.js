/**
 * WordPress dependencies
 */
import { select, useDispatch, useSelect } from '@wordpress/data';
import { useEffect, useState } from '@wordpress/element';
import { cloneElement } from '@wordpress/element';

/**
 * Internal dependencies
 */
import AccordionItem from './AccordionItem';

/**
 * External dependencies
 */
import { lowerCase, isEmpty } from 'lodash';
import classnames from 'classnames';

import {
	getIsActiveTab,
	getMaxiAttrsFromChildren,
} from '../../extensions/indicators';

const Accordion = props => {
	const {
		className,
		items,
		disablePadding = false,
		preExpandedAccordion,
		blockName,
	} = props;

	const [itemExpanded, setItemExpanded] = useState(preExpandedAccordion);

	const { updateInspectorPath } = useDispatch('maxiBlocks');

	const updatedItemExpanded = useSelect(
		() => select('maxiBlocks').receiveInspectorPath()?.[1]?.value
	);

	const { getBlockName, getSelectedBlockClientId } =
		select('core/block-editor');

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

				const itemsIndicators = !isEmpty(item.content)
					? cloneElement(item.content)
					: item;

				const classesItemButton = classnames(
					'maxi-accordion-control__item__button',
					getIsActiveTab(
						getMaxiAttrsFromChildren({
							items: itemsIndicators,
							blockName:
								blockName ??
								getBlockName(getSelectedBlockClientId()),
						}),
						item.breakpoint,
						item.extraIndicators,
						item.extraIndicatorsResponsive,
						item.ignoreIndicator
					) && 'maxi-accordion-control__item--active'
				);

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
						buttonClassName={classesItemButton}
						toggleExpanded={toggleExpanded}
					/>
				);
			})}
		</div>
	);
};

export default Accordion;

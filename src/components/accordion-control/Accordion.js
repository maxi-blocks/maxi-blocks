/**
 * WordPress dependencies
 */
import { select, useDispatch, useSelect } from '@wordpress/data';
import { useEffect, useState, cloneElement } from '@wordpress/element';
import { getBlockAttributes } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import AccordionItem from './AccordionItem';
import {
	getIsActiveTab,
	getMaxiAttrsFromChildren,
} from '@extensions/indicators';

/**
 * External dependencies
 */
import { lowerCase, isEmpty, isEqual, isPlainObject } from 'lodash';
import classnames from 'classnames';

/**
 * Checks if a value is considered "cleared" (inactive) for indicator purposes.
 * Matches the cleared-value logic used by getIsActiveTab.
 *
 * @param {*} value        - The current attribute value
 * @param {*} defaultValue - The default attribute value
 * @return {boolean} True if the value is cleared/inactive
 */
const isClearedValue = (value, defaultValue) => {
	if (value == null) return true; // null or undefined
	if (value === false) return true;
	if (value === '') return true;
	if (value === 'none' || value === 'unset') return true;
	if (Array.isArray(value) && value.length === 0) return true;
	if (isPlainObject(value) && isEmpty(value)) return true;
	// Treat 1 as cleared when default is undefined (common for opacity)
	if (value === 1 && defaultValue === undefined) return true;
	return isEqual(value, defaultValue);
};

const Accordion = props => {
	const {
		className,
		items,
		disablePadding = false,
		preExpandedAccordion,
		blockName,
		depth = 1,
		isStyleCard = false,
		isNestedAccordion = false,
	} = props;

	const isUpdateInspectorPath = !isStyleCard && !isNestedAccordion;

	const [itemExpanded, setItemExpanded] = useState(preExpandedAccordion);

	const { updateInspectorPath } = useDispatch('maxiBlocks');

	const updatedItemExpanded = useSelect(
		() => select('maxiBlocks').receiveInspectorPath()?.[depth]?.value
	);

	const { getBlockName, getSelectedBlockClientId } =
		select('core/block-editor');

	const toggleExpanded = uuid => {
		if (isUpdateInspectorPath) updateInspectorPath({ depth, value: uuid });
		setItemExpanded(uuid);
	};

	useEffect(() => {
		if (updatedItemExpanded !== itemExpanded) {
			if (isUpdateInspectorPath) setItemExpanded(updatedItemExpanded);
		}
	}, [updatedItemExpanded]);

	return (
		<div className={className} data-accordion-component='Accordion'>
			{items.map((item, id) => {
				if (!item) return null;

				const itemsIndicators = !isEmpty(item.content)
					? cloneElement(item.content)
					: item;

				let isActiveTab = false;

				if (item.indicatorProps) {
					const { getBlock, getSelectedBlockClientId } =
						select('core/block-editor');

					const block = getBlock(getSelectedBlockClientId());
					const { show_indicators: showIndicators } =
						select('maxiBlocks')?.receiveMaxiSettings?.() ?? {};

					if (
						showIndicators &&
						block &&
						block.name.includes('maxi-blocks')
					) {
						const { attributes, name } = block;
						const defaultAttributes = getBlockAttributes(name);
						isActiveTab = !item.indicatorProps.every(prop =>
							isClearedValue(
								attributes?.[prop],
								defaultAttributes?.[prop]
							)
						);
					}
				}

				const classesItemButton = classnames(
					'maxi-accordion-control__item__button',
					(item.indicatorProps
						? isActiveTab
						: getIsActiveTab(
								getMaxiAttrsFromChildren({
									items: itemsIndicators,
									blockName:
										blockName ??
										getBlockName(
											getSelectedBlockClientId()
										),
								}),
								item.breakpoint,
								item.extraIndicators,
								item.extraIndicatorsResponsive,
								item.ignoreIndicator,
								item.ignoreIndicatorGroups
						  )) && 'maxi-accordion-control__item--active'
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
					(disablePadding || item.disablePadding) &&
						'maxi-accordion-control__item__panel--disable-padding'
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

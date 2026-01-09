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
import { getDefaultAttribute } from '@extensions/styles';

/**
 * External dependencies
 */
import { lowerCase, isEmpty, isEqual } from 'lodash';
import classnames from 'classnames';

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
				const isNumericValue = value =>
					(typeof value === 'number' ||
						(typeof value === 'string' && value.trim() !== '')) &&
					!Number.isNaN(Number(value));
				const areEquivalent = (left, right) => {
					if (isNumericValue(left) && isNumericValue(right))
						return Number(left) === Number(right);

					return isEqual(left, right);
				};

				if (item.indicatorProps) {
					const { getBlock, getSelectedBlockClientId } =
						select('core/block-editor');

					const block = getBlock(getSelectedBlockClientId());

					const { show_indicators: showIndicators } =
						(typeof window !== 'undefined' &&
							window.maxiSettings) ||
						{};

						if (
							showIndicators &&
							block &&
							block.name.includes('maxi-blocks')
						) {
							const { attributes, name } = block;
							const defaultAttributes = getBlockAttributes(name);
							isActiveTab = !item.indicatorProps.every(prop => {
								if (Array.isArray(attributes[prop]))
									return isEmpty(attributes[prop]);
								if (
									name.includes('image-maxi') &&
									['altSelector', 'mediaAlt'].includes(prop) &&
									attributes.altSelector !== 'custom'
								)
									return true;
								if (
									name.includes('svg-icon-maxi') &&
									prop === 'svg-status-hover' &&
									attributes['svg-status-hover'] === false
								)
									return true;
								if (name.includes('svg-icon-maxi')) {
									const widthFitContentKey = `svg-width-fit-content-${prop.split('-').pop()}`;
									if (
										prop.startsWith('svg-width') &&
										attributes[prop] === '' &&
										attributes[widthFitContentKey] === false
									)
										return true;
								}
								if (
									name.includes('svg-icon-maxi') &&
									prop.startsWith('svg-stroke') &&
									attributes[prop] === ''
								)
									return true;
								if (
									name.includes('svg-icon-maxi') &&
									['svg-fill-color', 'svg-line-color'].includes(prop) &&
									attributes[`${prop}`] === '' &&
									attributes[`${prop.replace('-color', '-palette-status')}`] ===
										false
								)
									return true;

								const breakpointMatch = prop.match(
									/-(xxl|xl|l|m|s|xs)$/
								);
								const resolvedDefault =
									defaultAttributes[prop] ??
									getDefaultAttribute(
										prop,
										getSelectedBlockClientId()
									) ??
									(breakpointMatch
										? getDefaultAttribute(
												prop.replace(
													`-${breakpointMatch[1]}`,
													'-general'
												),
												getSelectedBlockClientId()
										  )
										: undefined);
								let currentValue =
									attributes[prop] === undefined
										? resolvedDefault
										: attributes[prop];
								if (
									prop.includes('border-style') &&
									(currentValue === '' ||
										currentValue === null ||
										currentValue === undefined)
								) {
									currentValue = 'none';
								}

								return areEquivalent(currentValue, resolvedDefault);
							});

							if (
								name.includes('image-maxi') &&
								attributes.altSelector !== 'custom' &&
								item.indicatorProps.some(prop =>
									['altSelector', 'mediaAlt'].includes(prop)
								)
							) {
								isActiveTab = false;
							}
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
					disablePadding || item.disablePadding
						? 'maxi-accordion-control__item__panel--disable-padding'
						: '',
					item.classNamePanel
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

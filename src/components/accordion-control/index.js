/**
 * WordPress dependencies
 */
import { cloneElement } from '@wordpress/element';
import { select, useDispatch } from '@wordpress/data';

/**
 * Internal dependencies
 */
import Icon from '../icon';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { lowerCase, isEmpty } from 'lodash';
import {
	Accordion,
	AccordionItem,
	AccordionItemHeading,
	AccordionItemButton,
	AccordionItemPanel,
} from 'react-accessible-accordion';

import { getActiveAccordion } from '../../extensions/inspector-path';
import {
	getIsActiveTab,
	getMaxiAttrsFromChildren,
} from '../../extensions/indicators';
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
		blockName,
	} = props;

	const { getBlockName, getSelectedBlockClientId } =
		select('core/block-editor');
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

				const itemsIndicators = !isEmpty(item.content)
					? cloneElement(item.content)
					: item;

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
						item.extraIndicatorsResponsive
					) && 'maxi-accordion-control__item--active'
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
							<AccordionItemButton className={classesItemButton}>
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

/**
 * WordPress dependencies
 */
import { useEffect, useState } from '@wordpress/element';
import { select, useDispatch } from '@wordpress/data';
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

	const { getSelectedBlockClientId } = select('core/block-editor');
	const { receiveOpenedSettings } = select('maxiBlocks');
	const { updateOpenedBlocksSettings } = useDispatch('maxiBlocks');

	const blockId = getSelectedBlockClientId();

	const openedBlocksSettingsObj = receiveOpenedSettings();
	const savedAccordiant =
		openedBlocksSettingsObj && openedBlocksSettingsObj[blockId]
			? openedBlocksSettingsObj[blockId][1]
			: undefined;

	const savedTab =
		openedBlocksSettingsObj && openedBlocksSettingsObj[blockId]
			? openedBlocksSettingsObj[blockId][0]
			: undefined;

	const setCurrentOpen = accordionId => {
		updateOpenedBlocksSettings({
			[blockId]:
				accordionId === savedAccordiant ? undefined : accordionId,
			type: 'accordion',
		});
	};

	return (
		<Accordion
			className={classes}
			allowMultipleExpanded={allowMultipleExpanded}
			allowZeroExpanded={allowZeroExpanded}
			preExpanded={[savedAccordiant]}
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
					lowerCase(`${item.label}${savedTab || 0}`).replace(
						/\s/g,
						''
					) || undefined;

				return (
					<AccordionItem
						uuid={accordionUid}
						className={classesItem}
						data-name={lowerCase(item.label)}
						key={`maxi-accordion-control__item-${id}`}
						onClick={() => setCurrentOpen(accordionUid)}
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

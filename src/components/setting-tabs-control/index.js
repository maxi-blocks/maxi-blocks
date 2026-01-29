/**
 * WordPress dependencies
 */
import { useState, useEffect, cloneElement } from '@wordpress/element';
import { getBlockAttributes } from '@wordpress/blocks';
import { select, useDispatch, useSelect } from '@wordpress/data';
import { Tooltip } from '@wordpress/components';

/**
 * Internal dependencies
 */
import BaseControl from '@components/base-control';
import Button from '@components/button';
import { getForcedTabFromPath } from '@extensions/inspector';
import {
	getIsActiveTab,
	getMaxiAttrsFromChildren,
} from '@extensions/indicators';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isEmpty, isNumber, isPlainObject, isEqual } from 'lodash';

/**
 * Checks if a value is considered "cleared" (inactive/default)
 *
 * @param {*}      value         The current value
 * @param {*}      defaultValue  The default value
 * @param {string} attributeName The attribute name (for special cases)
 * @return {boolean} True if the value is cleared/inactive
 */
const isClearedValue = (value, defaultValue, attributeName = '') => {
	if (value == null) return true; // null or undefined
	if (value === false) return true;
	if (value === '') return true;
	if (value === 'none' || value === 'unset') return true;
	if (Array.isArray(value) && value.length === 0) return true;
	if (isPlainObject(value) && isEmpty(value)) return true;
	// Treat 1 as cleared when default is undefined, only for opacity attributes
	if (
		value === 1 &&
		defaultValue === undefined &&
		/opacity/i.test(attributeName)
	) {
		return true;
	}
	return isEqual(value, defaultValue);
};

/**
 * Styles and icons
 */
import './editor.scss';

/**
 * Component
 */
const SettingTabsControl = props => {
	const {
		items,
		tab: tabProp,
		setTab: setTabProp,
		disablePadding = false,
		hasMarginBottom = false,
		isNestedAccordion = false,
		className,
		forceTab,
		returnValue,
		callback,
		target,
		onChange,
		type = 'tabs',
		selected,
		label,
		help,
		fullWidthMode,
		blockName,
		depth,
		hasBorder = false,
		showTooltip = false,
	} = props;
	const { getBlockName, getSelectedBlockClientId } =
		select('core/block-editor');

	const { updateInspectorPath } = useDispatch('maxiBlocks');

	const [localTab, setLocalTab] = useState(0);

	const tab = tabProp ?? localTab;
	const setTab = setTabProp ?? setLocalTab;

	const updatedTab = useSelect(
		() => select('maxiBlocks').receiveInspectorPath()?.[depth]?.value || 0
	);

	const currentForcedTab = getForcedTabFromPath(items, depth);
	const classes = classnames('maxi-settingstab-control', className);

	const classesControl = classnames(
		'maxi-tabs-control',
		target && `maxi-tabs-control__${target}`,
		disablePadding ? 'maxi-tabs-control--disable-padding' : null,
		fullWidthMode && 'maxi-tabs-control__full-width',
		hasBorder && 'maxi-settingstab-control_has-border-left-right',
		isNestedAccordion && 'maxi-tabs-control--nested',
		hasMarginBottom && 'maxi-tabs-control--bottom-space'
	);

	const classesBase = classnames(
		fullWidthMode && 'maxi-tabs-control__full-width'
	);

	const classesContent = classnames(
		'maxi-tabs-content',
		disablePadding ? 'maxi-tabs-content--disable-padding' : null,
		isNestedAccordion && 'maxi-tabs-content--nested'
	);

	const setActiveTab = (tab, name) => {
		setTab(tab);
		updateInspectorPath({ depth, name, value: tab });
	};

	useEffect(() => {
		if (updatedTab !== tab) {
			setTab(updatedTab);
		}
	}, [updatedTab]);

	useEffect(() => {
		if (currentForcedTab || currentForcedTab === 0) {
			setTab(currentForcedTab);
		}

		if (forceTab || forceTab === 0) {
			setTab(forceTab);
		}
	}, [forceTab, currentForcedTab]);

	useEffect(() => {
		if (returnValue) returnValue(items[tab]);
	}, [tab]);

	const getChildren = () => {
		return (
			<div className={classesControl}>
				{items.map((item, i) => {
					if (item) {
						const buttonLabel =
							!isEmpty(item.label) || isNumber(item.label)
								? item.label
								: item.value;
						const itemsIndicators = !isEmpty(item.content)
							? cloneElement(item.content)
							: item;

						// Handle indicatorProps directly like accordions do
						let isActiveTab = false;
						if (item.indicatorProps) {
							const { getBlock, getSelectedBlockClientId } =
								select('core/block-editor');

							const block = getBlock(getSelectedBlockClientId());
							const { show_indicators: showIndicators } =
								select('maxiBlocks')?.receiveMaxiSettings?.() ??
								{};

							if (
								showIndicators &&
								block &&
								block.name.includes('maxi-blocks')
							) {
								const { attributes, name } = block;
								const defaultAttributes =
									getBlockAttributes(name);
								isActiveTab = !item.indicatorProps.every(prop =>
									isClearedValue(
										attributes?.[prop],
										defaultAttributes?.[prop],
										prop
									)
								);
							}
						}

						const showButton = (
							<Button
								key={`maxi-tabs-control__button-${buttonLabel.toLowerCase()}`}
								label={item.value}
								className={classnames(
									'maxi-tabs-control__button',
									`maxi-tabs-control__button-${buttonLabel.toLowerCase()}`,
									selected === item.value &&
										'maxi-tabs-control__button--selected',
									isNestedAccordion &&
										'maxi-tabs-control__button--nested',
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
												item.ignoreIndicator
										  )) && 'maxi-tabs-control__button--active'
								)}
								onClick={() => {
									setActiveTab(i, item.label || item.value);
									if (callback) callback(item, i);
									if (item.callback) item.callback();

									type === 'buttons' && onChange(item.value);
								}}
								aria-pressed={
									type === 'tabs'
										? tab === i
										: selected === item.value
								}
							>
								{!isEmpty(item.label) && item.label}
								{!isEmpty(item.icon) && item.icon}
								{item.showNotification && (
									<svg
										className='maxi-tabs-control__notification'
										xmlns='http://www.w3.org/2000/svg'
										viewBox='0 0 9 9'
									>
										<path
											fill='#ff4a17'
											d='M4.5 0H9v4.5A4.5 4.5 0 0 1 4.5 9 4.5 4.5 0 0 1 0 4.5 4.5 4.5 0 0 1 4.5 0Z'
										/>
									</svg>
								)}
							</Button>
						);
						return showTooltip ? (
							<Tooltip
								key={`maxi-tabs-control__button-${buttonLabel.toLowerCase()}__tooltip`}
								text={item.label || item.value}
								placement='top'
							>
								{showButton}
							</Tooltip>
						) : (
							!showTooltip && showButton
						);
					}

					return null;
				})}
			</div>
		);
	};

	return (
		<div className={classes}>
			{type === 'buttons' && (
				<BaseControl
					label={label}
					help={help}
					aria-labelledby={label}
					className={classesBase}
					role='group'
				>
					{getChildren()}
				</BaseControl>
			)}
			{type === 'tabs' && getChildren()}
			{type === 'tabs' && (
				<div className={classesContent}>
					{items.map((item, i) => {
						if (item && i === tab) {
							const classesItemContent = classnames(
								'maxi-tab-content',
								tab === i ? 'maxi-tab-content--selected' : ''
							);

							return (
								<div
									key={`maxi-tab-content-${item.label}`}
									className={classesItemContent}
								>
									{item.content}
								</div>
							);
						}

						return null;
					})}
				</div>
			)}
		</div>
	);
};

export default SettingTabsControl;

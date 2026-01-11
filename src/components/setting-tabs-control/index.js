/**
 * WordPress dependencies
 */
import {
	useState,
	useEffect,
	cloneElement,
	useContext,
} from '@wordpress/element';
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
	SettingTabsIndicatorContext,
} from '@extensions/indicators';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isEmpty, isNumber } from 'lodash';

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
		/**
		 * Optional class name to be appended to the content wrapper (`.maxi-tabs-content`).
		 * Useful for one-off styling or visual debugging without affecting other instances.
		 */
		contentClassName,
	} = props;
	const { getBlockName, getSelectedBlockClientId } =
		select('core/block-editor');

	const { updateInspectorPath } = useDispatch('maxiBlocks');

	const [localTab, setLocalTab] = useState(0);
	const indicatorContext = useContext(SettingTabsIndicatorContext);

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
		isNestedAccordion && 'maxi-tabs-content--nested',
		contentClassName
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
						const buttonLabelSlug = String(buttonLabel).toLowerCase();
						const itemsIndicators = !isEmpty(item.content)
							? cloneElement(item.content)
							: item;

						const showButton = (
							<Button
								key={`maxi-tabs-control__button-${buttonLabelSlug}-${i}`}
								label={item.value}
								className={classnames(
									'maxi-tabs-control__button',
									`maxi-tabs-control__button-${buttonLabelSlug}`,
									selected === item.value &&
										'maxi-tabs-control__button--selected',
									isNestedAccordion &&
										'maxi-tabs-control__button--nested',
									getIsActiveTab(
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
										item.ignoreIndicatorGroups,
										indicatorContext
									) && 'maxi-tabs-control__button--active',
									item.className
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
									<div className='maxi-tabs-control__notification' />
								)}
							</Button>
						);
						return showTooltip ? (
							<Tooltip
								key={`maxi-tabs-control__button-${buttonLabelSlug}-${i}__tooltip`}
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
					__nextHasNoMarginBottom
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

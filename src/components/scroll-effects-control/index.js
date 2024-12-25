/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useEffect, useState } from '@wordpress/element';
/**
 * Internal dependencies
 */
import SettingTabsControl from '@components/setting-tabs-control';
import ScrollEffectUniqueControl from './scroll-effect-unique-control';
import {
	getDefaultAttribute,
	getLastBreakpointAttribute,
} from '@extensions/styles';
import { scrollTypes } from '@extensions/styles/defaults/scroll';
import SelectControl from '@components/select-control';
import AdvancedNumberControl from '@components/advanced-number-control';
import ToggleSwitch from '@components/toggle-switch';
import * as defaultShortcuts from './shortcuts';
import { applyEffect, removeEffect } from './scroll-effect-preview';
import { getActiveTabName } from '@extensions/inspector';
import {
	motionOptions,
	motionSubOptions,
	easingOptions,
	viewportOptions,
	globalShortcutsOptions,
	getShortcutEffect,
} from './options';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { toLower, capitalize, pickBy, cloneDeep, toNumber } from 'lodash';

/**
 * Styles
 */
import './editor.scss';

/**
 * Component
 */
const ScrollEffectsControl = props => {
	const {
		className,
		onChange,
		breakpoint = 'general',
		uniqueID,
		depth,
	} = props;

	const classes = classnames('maxi-scroll-effects-control', className);

	const activeTabName = getActiveTabName(depth);

	const getActiveEffects = () => {
		const response = [];
		scrollTypes.forEach(type => {
			if (props[`scroll-${type}-status-${breakpoint}`])
				response.push(type);
		});

		return response;
	};

	const findScrollSubStatuses = type => {
		return motionSubOptions.find(subTypeArray =>
			subTypeArray.some(({ value }) => value === type)
		);
	};

	const findScrollSubStatusValue = type => {
		return findScrollSubStatuses(type)?.[0]?.value;
	};

	const firstActiveEffect = getActiveEffects()?.[0] || 'vertical';
	const [scrollStatus, setScrollStatus] = useState(firstActiveEffect);
	const [scrollSubStatus, setScrollSubStatus] = useState(
		findScrollSubStatusValue(firstActiveEffect)
	);

	const type = scrollSubStatus || scrollStatus;

	const isBlockZone = getLastBreakpointAttribute({
		target: `scroll-${type}-is-block-zone`,
		breakpoint,
		attributes: props,
	});
	const isPreviewEnabled = getLastBreakpointAttribute({
		target: `scroll-${type}-preview-status`,
		breakpoint,
		attributes: props,
	});

	const motionProps = pickBy(props, (val, key) => {
		return key.includes('scroll-');
	});

	const onChangeShortcut = (number, type) => {
		const newDefaultShortcuts = cloneDeep({ ...defaultShortcuts });

		if (type)
			onChange({
				...newDefaultShortcuts?.[type]?.[`shortcut${number}`],
				shortcutEffectType: {
					...props.shortcutEffectType,
					[type]: number,
				},
			});
		else
			onChange({
				...newDefaultShortcuts?.[`shortcut${number}`],
				shortcutEffect: toNumber(number),
			});
	};

	useEffect(() => {
		if (activeTabName) {
			setScrollStatus(toLower(activeTabName));
		}
	});

	return (
		<div className={classes}>
			<SelectControl
				__nextHasNoMarginBottom
				className='maxi-scroll-combinations-select'
				label={__('Scroll combinations', 'maxi-blocks')}
				onChange={val => onChangeShortcut(val)}
				value={props.shortcutEffect}
				options={globalShortcutsOptions}
				newStyle
			/>
			<SettingTabsControl
				type='buttons'
				fullWidthMode
				selected={scrollStatus}
				items={motionOptions}
				onChange={val => {
					setScrollStatus(val);
					setScrollSubStatus(findScrollSubStatusValue(val));
				}}
				hasBorder
			/>
			<div key={`maxi-scroll-effects-control-${type}-${breakpoint}`}>
				{findScrollSubStatuses(type) && (
					<SettingTabsControl
						type='buttons'
						fullWidthMode
						selected={scrollSubStatus}
						items={findScrollSubStatuses(type)}
						onChange={val => {
							setScrollSubStatus(val);
						}}
						depth={3}
						hasBorder
					/>
				)}
				<ToggleSwitch
					// eslint-disable-next-line @wordpress/i18n-no-collapsible-whitespace
					label={__(`Activate ${type} scroll`, 'maxi-blocks')}
					selected={getLastBreakpointAttribute({
						target: `scroll-${type}-status`,
						breakpoint,
						attributes: props,
					})}
					onChange={val => {
						onChange({
							[`scroll-${type}-status-${breakpoint}`]: val,
						});
						val &&
							isPreviewEnabled &&
							applyEffect(type, uniqueID, 'Start');
						!val &&
							removeEffect(type, uniqueID) &&
							onChange({
								[`scroll-${type}-preview-status-general`]: false,
							});
					}}
				/>
				{breakpoint === 'general' &&
					getLastBreakpointAttribute({
						target: `scroll-${type}-status`,
						breakpoint,
						attributes: props,
					}) && (
						<>
							<SelectControl
								__nextHasNoMarginBottom
								label={__('Direction preset', 'maxi-blocks')}
								newStyle
								value={props.shortcutEffectType?.[type]}
								onChange={val => onChangeShortcut(val, type)}
								options={getShortcutEffect(type)}
							/>
							<SelectControl
								__nextHasNoMarginBottom
								label={__('Easing function', 'maxi-blocks')}
								newStyle
								value={getLastBreakpointAttribute({
									target: `scroll-${type}-easing`,
									breakpoint,
									attributes: props,
								})}
								onChange={val =>
									onChange({
										[`scroll-${type}-easing-${breakpoint}`]:
											val,
									})
								}
								options={easingOptions}
							/>
							<AdvancedNumberControl
								label={__('Speed (ms)', 'maxi-blocks')}
								value={getLastBreakpointAttribute({
									target: `scroll-${type}-speed`,
									breakpoint,
									attributes: props,
								})}
								onChangeValue={val => {
									onChange({
										[`scroll-${type}-speed-${breakpoint}`]:
											val !== undefined && val !== ''
												? val
												: '',
									});
								}}
								min={0}
								step={10}
								max={10000}
								onReset={() =>
									onChange({
										[`scroll-${type}-speed-${breakpoint}`]:
											getDefaultAttribute(
												`scroll-${type}-speed-general`
											),
										isReset: true,
									})
								}
								initialPosition={getDefaultAttribute(
									`scroll-${type}-speed-general`
								)}
							/>
							<AdvancedNumberControl
								label={__('Delay (ms)', 'maxi-blocks')}
								value={getLastBreakpointAttribute({
									target: `scroll-${type}-delay`,
									breakpoint,
									attributes: props,
								})}
								onChangeValue={val => {
									onChange({
										[`scroll-${type}-delay-${breakpoint}`]:
											val !== undefined && val !== ''
												? val
												: '',
									});
								}}
								min={0}
								step={10}
								max={10000}
								onReset={() =>
									onChange({
										[`scroll-${type}-delay-${breakpoint}`]:
											getDefaultAttribute(
												`scroll-${type}-delay-general`
											),
										isReset: true,
									})
								}
								initialPosition={getDefaultAttribute(
									`scroll-${type}-delay-general`
								)}
							/>
							<ToggleSwitch
								label={__(
									'Use block height as zone reference',
									'maxi-blocks'
								)}
								selected={isBlockZone}
								onChange={val =>
									onChange({
										[`scroll-${type}-is-block-zone-${breakpoint}`]:
											val,
									})
								}
							/>
							{isBlockZone && (
								<SelectControl
									__nextHasNoMarginBottom
									label={__('Viewport entry', 'maxi-blocks')}
									value={getLastBreakpointAttribute({
										target: `scroll-${type}-viewport-top`,
										breakpoint,
										attributes: props,
									})}
									onChange={val =>
										onChange({
											[`scroll-${type}-viewport-top-${breakpoint}`]:
												val,
										})
									}
									newStyle
									options={viewportOptions}
									defaultValue='mid'
								/>
							)}
							{/*
									// TODO: fix #5002
									<ToggleSwitch
										label={__(
											'Simulate scroll effect live (test)',
											'maxi-blocks'
										)}
										selected={isPreviewEnabled}
										onChange={val => {
											onChange({
												[`scroll-${type}-preview-status-general`]:
													val,
											});

											const handlePreviewStatusChange =
												uniqueIDToAffect => {
													if (val) {
														applyEffect(
															type,
															uniqueIDToAffect,
															'Start'
														);
													} else {
														removeEffect(
															type,
															uniqueIDToAffect
														);
													}
												};

											handlePreviewStatusChange(uniqueID);

											if (
												repeaterContext?.repeaterStatus
											) {
												const innerBlockPositions =
													repeaterContext?.getInnerBlocksPositions?.();

												const blockPosition =
													getBlockPosition(
														clientId,
														innerBlockPositions
													);

												if (
													innerBlockPositions?.[
														blockPosition
													]
												) {
													innerBlockPositions[
														blockPosition
													].forEach(blockClientId => {
														if (
															blockClientId ===
															clientId
														)
															return;

														const blockUniqueId =
															select(
																'core/block-editor'
															).getBlock(
																blockClientId
															)?.attributes
																?.uniqueID;

														if (blockUniqueId) {
															handlePreviewStatusChange(
																blockUniqueId
															);
														}
													});
												}
											}
										}}
									/> */}
							<ScrollEffectUniqueControl
								label={__(`${capitalize(type)}`, 'maxi-blocks')}
								type={type}
								values={motionProps}
								breakpoint={breakpoint}
								onChange={value => onChange(value)}
								uniqueID={uniqueID}
								isPreviewEnabled={isPreviewEnabled}
							/>
							<ToggleSwitch
								label={__(
									'Reverse scroll playback',
									'maxi-blocks'
								)}
								selected={
									+getLastBreakpointAttribute({
										target: `scroll-${type}-status-reverse`,
										breakpoint,
										attributes: props,
									})
								}
								onChange={val =>
									onChange({
										[`scroll-${type}-status-reverse-${breakpoint}`]:
											!!+val,
									})
								}
							/>
						</>
					)}
			</div>
		</div>
	);
};

export default ScrollEffectsControl;

/* eslint-disable @wordpress/i18n-no-collapsible-whitespace */
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import AdvancedNumberControl from '@components/advanced-number-control';
import BaseControl from '@components/base-control';
import Button from '@components/button';
import SettingTabsControl from '@components/setting-tabs-control';
import SelectControl from '@components/select-control';
import ResponsiveTabsControl from '@components/responsive-tabs-control';
import {
	getLastBreakpointAttribute,
	getDefaultAttribute,
	getAttributeKey,
} from '@extensions/styles';
import ResetButton from '@components/reset-control';

/**
 * External dependencies
 */
import classnames from 'classnames';
import {
	isArray,
	isEmpty,
	isNaN,
	capitalize,
	isNumber,
	round,
	isNil,
	kebabCase,
} from 'lodash';

/**
 * Styles and icons
 */
import './editor.scss';
import {
	marginSeparate as marginSeparateIcon,
	marginSyncAll as marginSyncAllIcon,
	marginSyncDirection as marginSyncDirectionIcon,
	paddingSeparate as paddingSeparateIcon,
	paddingSyncAll as paddingSyncAllIcon,
	paddingSyncDirection as paddingSyncDirectionIcon,
} from '@maxi-icons';

const linkedPairIcon = (
	<svg
		viewBox='0 0 28 28'
		preserveAspectRatio='xMidYMid meet'
		shapeRendering='geometricPrecision'
		aria-hidden='true'
		focusable='false'
	>
		<g>
			<path
				d='M11.25 10.5H10.1C8.17 10.5 6.6 12.07 6.6 14s1.57 3.5 3.5 3.5h1.15'
				stroke='currentColor'
				strokeWidth='2'
				strokeLinecap='round'
				strokeLinejoin='round'
				fill='none'
			/>
			<path
				d='M16.75 17.5h1.15c1.93 0 3.5-1.57 3.5-3.5s-1.57-3.5-3.5-3.5h-1.15'
				stroke='currentColor'
				strokeWidth='2'
				strokeLinecap='round'
				strokeLinejoin='round'
				fill='none'
			/>
			<path
				d='M11.25 14h5.5'
				stroke='currentColor'
				strokeWidth='2'
				strokeLinecap='round'
			/>
		</g>
	</svg>
);

const unlinkedPairIcon = (
	<svg
		viewBox='0 0 28 28'
		preserveAspectRatio='xMidYMid meet'
		shapeRendering='geometricPrecision'
		aria-hidden='true'
		focusable='false'
	>
		<g>
			<path
				d='M11.25 10.5H10.1C8.17 10.5 6.6 12.07 6.6 14s1.57 3.5 3.5 3.5h1.15'
				stroke='currentColor'
				strokeWidth='2'
				strokeLinecap='round'
				strokeLinejoin='round'
				fill='none'
			/>
			<path
				d='M16.75 17.5h1.15c1.93 0 3.5-1.57 3.5-3.5s-1.57-3.5-3.5-3.5h-1.15'
				stroke='currentColor'
				strokeWidth='2'
				strokeLinecap='round'
				strokeLinejoin='round'
				fill='none'
			/>
		</g>
	</svg>
);

const getAxisInputLabel = label => capitalize(label.replace(/-/g, ' '));

/**
 * Component
 */
const AxisInput = props => {
	const {
		label,
		target,
		singleTarget = null,
		getValue,
		getLastBreakpointValue,
		breakpoint,
		disableAuto,
		onChangeValue,
		minMaxSettings,
		currentUnit,
		enableAxisUnits,
		onChangeUnit,
		onReset,
		disableRange,
		extraClassName,
		isSpacingControl = false,
		isCompactControl = false,
		unitTarget,
		supportsAuto = true,
	} = props;

	const rawValue = getValue(target, breakpoint);
	const rawLastValue = getLastBreakpointValue(target);
	const value =
		isSpacingControl && !supportsAuto && rawValue === 'auto'
			? ''
			: rawValue;
	const lastValue =
		isSpacingControl && !supportsAuto && rawLastValue === 'auto'
			? ''
			: rawLastValue;

	const unit = getLastBreakpointValue(
		unitTarget || `${target}-unit`,
		breakpoint
	);

	const isAxisMode =
		singleTarget === 'vertical' || singleTarget === 'horizontal';

	return (
		<AdvancedNumberControl
			label={__(getAxisInputLabel(label), 'maxi-blocks')}
			className={classnames(
				'maxi-axis-control__content__item',
				`maxi-axis-control__content__item__${kebabCase(label)}`,
				extraClassName
			)}
			placeholder={lastValue}
			value={value}
			onChangeValue={(val, meta) =>
				onChangeValue(val, singleTarget, breakpoint, undefined, meta)
			}
			minMaxSettings={minMaxSettings}
			enableAuto={!disableAuto && supportsAuto}
			autoLabel={__(`Auto ${label.toLowerCase()}`, 'maxi-blocks')}
			classNameAutoInput={classnames(
				'maxi-axis-control__item-auto',
				isAxisMode && 'maxi-axis-control__item-auto--axis-mode'
			)}
			enableUnit={enableAxisUnits}
			min={minMaxSettings[currentUnit].min || 0}
			max={minMaxSettings[currentUnit].max || 999}
			step={minMaxSettings[currentUnit].step || 1}
			onChangeUnit={val => {
				if (unitTarget) onChangeUnit(val, singleTarget, breakpoint);
				else onChangeUnit(val, singleTarget, breakpoint, '-unit');
			}}
			unit={unit}
			onReset={onReset}
			disableRange={disableRange}
			resetButtonSize={isCompactControl ? 'small' : undefined}
		/>
	);
};

const AxisContent = props => {
	const {
		getKey,
		breakpoint,
		isHover,
		inputsArray,
		getValue,
		getLastBreakpointValue,
		disableAuto,
		onChangeValue,
		minMaxSettings,
		currentUnit,
		disableSync = false,
		label: type,
		onReset,
		disableLeftRightMargin,
		onChangeUnit,
		enableAxisUnits,
		disableRange,
		target,
		auxTarget,
		showAllSides,
		getPairSyncValue,
		getAllSyncValue,
		onChangePairSync,
		onChangeAllSync,
		getPairForSide,
		onChangeSharedUnit,
	} = props;

	const sync = getLastBreakpointAttribute({
		target: getKey('sync'),
		breakpoint,
		attributes: props,
		isHover,
	});

	const getContainerClass = () => {
		if (disableSync) return '';

		switch (sync) {
			case 'all':
				return 'maxi-axis-control__all-mode';
			case 'none':
				return 'maxi-axis-control__content__separate-grid';
			case 'axis':
				return 'maxi-axis-control__axis-mode';
			default:
				return '';
		}
	};
	const isSpacingControl = target === 'margin' || target === 'padding';
	const supportsAuto = !disableAuto;
	const usesSharedUnitInInputs = showAllSides && auxTarget === 'radius';
	const shouldShowAllSides = showAllSides;

	const getRows = () => {
		if (auxTarget === 'radius') {
			return [
				{
					pair: 'vertical',
					left: inputsArray[0],
					right: inputsArray[1],
					leftReset: inputsArray[0],
					rightReset: inputsArray[1],
				},
				{
					pair: 'horizontal',
					left: inputsArray[3],
					right: inputsArray[2],
					leftReset: inputsArray[3],
					rightReset: inputsArray[2],
				},
			];
		}

		return [
			{
				pair: 'vertical',
				left: inputsArray[0],
				right: inputsArray[2],
				leftReset: 'top',
				rightReset: 'bottom',
			},
			{
				pair: 'horizontal',
				left: inputsArray[3],
				right: inputsArray[1],
				leftReset: 'left',
				rightReset: 'right',
			},
		];
	};

	const renderSideInput = ({ side, reset, extraClassName }) => (
		<AxisInput
			label={side}
			target={side}
			singleTarget={side}
			getValue={getValue}
			getLastBreakpointValue={getLastBreakpointValue}
			breakpoint={breakpoint}
			disableAuto={disableAuto}
			onChangeValue={onChangeValue}
			minMaxSettings={minMaxSettings}
			currentUnit={currentUnit}
			type={type}
			isSpacingControl={isSpacingControl}
			isCompactControl={showAllSides}
			supportsAuto={supportsAuto}
			enableAxisUnits={enableAxisUnits || usesSharedUnitInInputs}
			onChangeUnit={
				usesSharedUnitInInputs
					? (val, _singleTarget, customBreakpoint) =>
							onChangeSharedUnit(val, customBreakpoint)
					: onChangeUnit
			}
			unitTarget={usesSharedUnitInInputs ? 'unit' : undefined}
			onReset={() => {
				const pair = getPairForSide(side);

				onReset({
					reset: getAllSyncValue(breakpoint)
						? 'all'
						: getPairSyncValue(pair, breakpoint)
						? pair
						: reset,
					customBreakpoint: breakpoint,
				});
			}}
			extraClassName={classnames(
				extraClassName,
				getAllSyncValue(breakpoint) &&
					(target === 'margin' || target === 'padding') &&
					`maxi-axis-control__content__item__${target}`,
				auxTarget === 'radius' &&
					'maxi-axis-control__content__item__border-radius'
			)}
			disableRange={disableRange}
		/>
	);

	const renderPairActions = pair => {
		const isAllLinked = getAllSyncValue(breakpoint);
		const isLinked = getPairSyncValue(pair, breakpoint);
		const isMuted = isAllLinked;
		let linkLabel;

		if (auxTarget === 'radius') {
			linkLabel =
				pair === 'vertical'
					? __('Link top corners', 'maxi-blocks')
					: __('Link bottom corners', 'maxi-blocks');
		} else {
			linkLabel =
				pair === 'vertical'
					? __('Link top and bottom', 'maxi-blocks')
					: __('Link left and right', 'maxi-blocks');
		}

		return (
			<div
				className={classnames(
					'maxi-axis-control__pair-actions',
					`maxi-axis-control__pair-actions--${pair}`
				)}
			>
				<Button
					className={classnames(
						'maxi-axis-control__pair-link',
						isLinked &&
							!isMuted &&
							'maxi-axis-control__pair-link--active',
						isMuted && 'maxi-axis-control__pair-link--muted'
					)}
					label={linkLabel}
					isPressed={isLinked && !isMuted}
					disabled={isMuted}
					onClick={() =>
						onChangePairSync(pair, !isLinked, breakpoint)
					}
				>
					{isLinked ? linkedPairIcon : unlinkedPairIcon}
				</Button>
			</div>
		);
	};

	const renderAllActions = () => {
		const isLinked = getAllSyncValue(breakpoint);
		const linkLabel =
			auxTarget === 'radius'
				? __('Link all corners', 'maxi-blocks')
				: __('Link all sides', 'maxi-blocks');

		return (
			<div className='maxi-axis-control__all-actions'>
				<div />
				<div
					className={classnames(
						'maxi-axis-control__pair-actions',
						'maxi-axis-control__pair-actions--all'
					)}
				>
					<Button
						className={classnames(
							'maxi-axis-control__pair-link',
							isLinked && 'maxi-axis-control__pair-link--active'
						)}
						label={linkLabel}
						isPressed={isLinked}
						onClick={() =>
							onChangeAllSync(!isLinked, breakpoint)
						}
					>
						{isLinked ? linkedPairIcon : unlinkedPairIcon}
					</Button>
				</div>
				<div />
			</div>
		);
	};

	if (shouldShowAllSides) {
		const rows = getRows();

		return (
			<div
				className='maxi-axis-control__content__separate-grid'
				data-sync='none'
			>
				<div className='maxi-axis-control__row-1 maxi-axis-control__row--top'>
					<div>
						{renderSideInput({
							side: rows[0].left,
							reset: rows[0].leftReset,
							extraClassName:
								'maxi-axis-control__item--top-row',
						})}
					</div>
					{renderPairActions(rows[0].pair)}
					<div>
						{renderSideInput({
							side: rows[0].right,
							reset: rows[0].rightReset,
							extraClassName:
								'maxi-axis-control__item--top-row',
						})}
					</div>
				</div>
				{renderAllActions()}
				<div className='maxi-axis-control__row-2'>
					<div>
						{renderSideInput({
							side: rows[1].left,
							reset: rows[1].leftReset,
						})}
					</div>
					{renderPairActions(rows[1].pair)}
					<div>
						{renderSideInput({
							side: rows[1].right,
							reset: rows[1].rightReset,
						})}
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className={getContainerClass()} data-sync={sync}>
			{(sync === 'all' || disableSync) && (
				<AxisInput
					label={isSpacingControl ? '' : type}
					target={inputsArray[0]}
					getValue={getValue}
					getLastBreakpointValue={getLastBreakpointValue}
					breakpoint={breakpoint}
					disableAuto={disableAuto}
					onChangeValue={onChangeValue}
					minMaxSettings={minMaxSettings}
					currentUnit={currentUnit}
					type={type}
					isSpacingControl={isSpacingControl}
					supportsAuto={supportsAuto}
					enableAxisUnits={enableAxisUnits}
					onChangeUnit={onChangeUnit}
					onReset={() => onReset({ reset: 'all' })}
					disableRange={disableRange}
				/>
			)}
			{sync === 'axis' && !disableSync && (
				<>
					<div className='maxi-axis-control__row-1 maxi-axis-control__row--top'>
						<AxisInput
							label={`${inputsArray[0]} / ${inputsArray[2]}`}
							target={inputsArray[0]}
							singleTarget='vertical'
							getValue={getValue}
							getLastBreakpointValue={getLastBreakpointValue}
							breakpoint={breakpoint}
							disableAuto={disableAuto}
							onChangeValue={onChangeValue}
							minMaxSettings={minMaxSettings}
							currentUnit={currentUnit}
							type={type}
							isSpacingControl={isSpacingControl}
							supportsAuto={supportsAuto}
							enableAxisUnits={enableAxisUnits}
							onChangeUnit={onChangeUnit}
							onReset={() => onReset({ reset: 'vertical' })}
							extraClassName='maxi-axis-control__item--top-row'
							disableRange={disableRange}
						/>
					</div>
					<div className='maxi-axis-control__row-2'>
						{!disableLeftRightMargin && (
							<AxisInput
								label={`${inputsArray[3]} / ${inputsArray[1]}`}
								target={inputsArray[1]}
								singleTarget='horizontal'
								getValue={getValue}
								getLastBreakpointValue={getLastBreakpointValue}
								breakpoint={breakpoint}
								disableAuto={disableAuto}
								onChangeValue={onChangeValue}
								minMaxSettings={minMaxSettings}
								currentUnit={currentUnit}
								type={type}
								isSpacingControl={isSpacingControl}
								supportsAuto={supportsAuto}
								enableAxisUnits={enableAxisUnits}
								onChangeUnit={onChangeUnit}
								onReset={() => onReset({ reset: 'horizontal' })}
								disableRange={disableRange}
							/>
						)}
					</div>
				</>
			)}
			{sync === 'none' && !disableSync && (
				<>
					{/* First row: Top + Right */}
					<div className='maxi-axis-control__row-1 maxi-axis-control__row--top'>
						<div>
							<AxisInput
								label={inputsArray[0]}
								target={inputsArray[0]}
								singleTarget={inputsArray[0]}
								getValue={getValue}
								getLastBreakpointValue={getLastBreakpointValue}
								breakpoint={breakpoint}
								disableAuto={disableAuto}
								onChangeValue={onChangeValue}
								minMaxSettings={minMaxSettings}
								currentUnit={currentUnit}
								type={type}
								isSpacingControl={isSpacingControl}
								supportsAuto={supportsAuto}
								enableAxisUnits={enableAxisUnits}
								onChangeUnit={onChangeUnit}
								onReset={() => onReset({ reset: 'top' })}
								extraClassName='maxi-axis-control__item--top-row'
								disableRange={disableRange}
							/>
						</div>
						{!disableLeftRightMargin && (
							<div>
								<AxisInput
									label={inputsArray[1]}
									target={inputsArray[1]}
									singleTarget={inputsArray[1]}
									getValue={getValue}
									getLastBreakpointValue={
										getLastBreakpointValue
									}
									breakpoint={breakpoint}
									disableAuto={disableAuto}
									onChangeValue={onChangeValue}
									minMaxSettings={minMaxSettings}
									currentUnit={currentUnit}
									type={type}
									isSpacingControl={isSpacingControl}
									supportsAuto={supportsAuto}
									enableAxisUnits={enableAxisUnits}
									onChangeUnit={onChangeUnit}
									onReset={() => onReset({ reset: 'right' })}
									extraClassName='maxi-axis-control__item--top-row'
									disableRange={disableRange}
								/>
							</div>
						)}
					</div>
					{/* Second row: Bottom + Left */}
					<div className='maxi-axis-control__row-2'>
						<div>
							<AxisInput
								label={inputsArray[2]}
								target={inputsArray[2]}
								singleTarget={inputsArray[2]}
								getValue={getValue}
								getLastBreakpointValue={getLastBreakpointValue}
								breakpoint={breakpoint}
								disableAuto={disableAuto}
								onChangeValue={onChangeValue}
								minMaxSettings={minMaxSettings}
								currentUnit={currentUnit}
								type={type}
								isSpacingControl={isSpacingControl}
								supportsAuto={supportsAuto}
								enableAxisUnits={enableAxisUnits}
								onChangeUnit={onChangeUnit}
								onReset={() => onReset({ reset: 'bottom' })}
								disableRange={disableRange}
							/>
						</div>
						{!disableLeftRightMargin && (
							<div>
								<AxisInput
									label={inputsArray[3]}
									target={inputsArray[3]}
									singleTarget={inputsArray[3]}
									getValue={getValue}
									getLastBreakpointValue={
										getLastBreakpointValue
									}
									breakpoint={breakpoint}
									disableAuto={disableAuto}
									onChangeValue={onChangeValue}
									minMaxSettings={minMaxSettings}
									currentUnit={currentUnit}
									type={type}
									isSpacingControl={isSpacingControl}
									supportsAuto={supportsAuto}
									enableAxisUnits={enableAxisUnits}
									onChangeUnit={onChangeUnit}
									onReset={() => onReset({ reset: 'left' })}
									disableRange={disableRange}
								/>
							</div>
						)}
					</div>
				</>
			)}
		</div>
	);
};

const AxisControlContent = props => {
	const {
		label: type,
		getOptions,
		currentUnit,
		breakpoint,
		isHover,
		onChange,
		onReset,
		getKey,
		onChangeSync,
		minMaxSettings,
		inputsArray,
		disableSync = false,
		enableAxisUnits,
		target,
		auxTarget,
		showAllSides,
	} = props;

	const isSpacingControl = target === 'margin' || target === 'padding';
	const shouldShowAllSides = showAllSides;

	const sync =
		getLastBreakpointAttribute({
			target: getKey('sync'),
			breakpoint,
			attributes: props,
			isHover,
		}) || 'none'; // Default to 'none' (Set separately)

	const getSyncLabel = () => {
		const label =
			type.toLowerCase() === 'border radius'
				? 'border radii'
				: type.toLowerCase();
		const textSeparate =
			label === 'border radius' ? 'separate' : 'separately';
		switch (sync) {
			case 'all':
				return type
					? __(`Set ${label} equal`, 'maxi-blocks')
					: __('Set equal', 'maxi-blocks');
			case 'axis':
				return type
					? __(`Set ${label} together`, 'maxi-blocks')
					: __('Set together', 'maxi-blocks');
			case 'none':
			default:
				return type
					? __(`Set ${label} ${textSeparate}`, 'maxi-blocks')
					: __('Set separate', 'maxi-blocks');
		}
	};

	const onChangeUnit = val => {
		const response = {};

		inputsArray.forEach(input => {
			if (
				input.includes('top') ||
				input.includes('left') ||
				input.includes('bottom') ||
				input.includes('right')
			) {
				const key = getAttributeKey(
					getKey(input),
					isHover,
					false,
					breakpoint
				);
				const value = getLastBreakpointAttribute({
					target: getKey(input),
					breakpoint,
					attributes: props,
					isHover,
				});

				if (!isNil(value) && isNumber(value))
					response[key] = round(
						value,
						minMaxSettings[currentUnit].step / 0.5
					);
			}
		});

		onChange({
			[getAttributeKey(getKey('unit'), isHover, false, breakpoint)]: val,
			...response,
		});
	};

	const renderUnitHeader = () =>
		!enableAxisUnits && (
			<BaseControl
				__nextHasNoMarginBottom
				label={__(type, 'maxi-blocks')}
				className='maxi-axis-control__unit-header'
			>
				<SelectControl
					__nextHasNoMarginBottom
					className='maxi-axis-control__units'
					hideLabelFromVision
					label={__('Unit', 'maxi-blocks')}
					options={getOptions()}
					value={currentUnit}
					onChange={onChangeUnit}
				/>
				<ResetButton
					className='maxi-reset-button--absolute maxi-reset-button--typography'
					isAbsolute
					onReset={() =>
						onReset({
							reset: 'unit',
							customBreakpoint: breakpoint,
						})
					}
				/>
			</BaseControl>
		);

	if (shouldShowAllSides) {
		return (
			<>
				{renderUnitHeader() || (
					<div className='maxi-axis-control__spacing-heading'>
						{__(type, 'maxi-blocks')}
					</div>
				)}
				<AxisContent
					{...props}
					auxTarget={auxTarget}
					onChangeSharedUnit={onChangeUnit}
				/>
			</>
		);
	}

	return (
		<>
			{!disableSync && (
				<>
					{renderUnitHeader()}
					<SettingTabsControl
						label={
							isSpacingControl
								? __(type, 'maxi-blocks')
								: getSyncLabel()
						}
						type='buttons'
						className={classnames(
							'maxi-axis-control__header',
							'maxi-axis-control__sync',
							`maxi-axis-control__sync--${sync}`
						)}
						selected={sync}
						hasBorder
						items={[
							{
								value: 'all',
								className: 'maxi-axis-control__sync-all',
								icon:
									type === 'Margin'
										? marginSyncAllIcon
										: paddingSyncAllIcon,
							},
							{
								value: 'axis',
								className: classnames(
									'maxi-axis-control__sync-axis',
									'maxi-tabs-control__button--sync-axis'
								),
								icon:
									type === 'Margin'
										? marginSyncDirectionIcon
										: paddingSyncDirectionIcon,
							},
							{
								value: 'none',
								className: 'maxi-axis-control__sync-none',
								icon:
									type === 'Margin'
										? marginSeparateIcon
										: paddingSeparateIcon,
							},
						]}
						onChange={val => onChangeSync(val, breakpoint)}
					/>
					<AxisContent {...props} />
				</>
			)}
			{disableSync && <AxisContent {...props} />}
		</>
	);
};

const AxisControl = props => {
	const {
		label = '',
		className,
		onChange,
		breakpoint = 'general',
		disableAuto = false,
		allowedUnits = ['px', 'em', 'vw', '%'],
		target,
		noResponsiveTabs,
		prefix = '',
		minMaxSettings = {
			px: {
				min: target === 'padding' ? 0 : -999,
				max: 999,
				step: 1,
			},
			em: {
				min: target === 'padding' ? 0 : -999,
				max: 999,
				step: 0.1,
			},
			vw: {
				min: target === 'padding' ? 0 : -999,
				max: 999,
				step: 0.1,
			},
			'%': {
				min: 0,
				max: 999,
				step: 0.1,
			},
		},
		auxTarget = false,
		isHover = false,
		inputsArray = [
			'top',
			'right',
			'bottom',
			'left',
			'top-unit',
			'right-unit',
			'bottom-unit',
			'left-unit',
			'unit',
		],
		optionType = 'number',
		disableSync = false,
		fullWidth,
		enableAxisUnits,
		defaultAttributes = null,
		showAllSides = false,
	} = props;

	const classes = classnames(
		'maxi-axis-control',
		target && `maxi-axis-control__${target}`,
		showAllSides && 'maxi-axis-control--show-all-sides',
		showAllSides && !disableAuto && 'maxi-axis-control--has-auto',
		disableAuto && 'maxi-axis-control__disable-auto',
		className
	);

	const useResponsiveTabs =
		!noResponsiveTabs &&
		['margin', 'padding'].includes(target);

	// Get sync mode to determine if left/right margin should be disabled
	const sync = getLastBreakpointAttribute({
		target: `${prefix}${target}-sync`,
		breakpoint,
		attributes: props,
		isHover,
	});

	// Only disable left/right margin when fullWidth is true AND sync is 'all' (equal mode)
	// Allow left/right margins in 'none' (separate) and 'axis' (together) modes
	const disableLeftRightMargin =
		!showAllSides && target === 'margin' && fullWidth && sync === 'all';

	const getOptions = () => {
		const options = [];
		allowedUnits.includes('px') &&
			options.push({ label: 'PX', value: 'px' });
		allowedUnits.includes('em') &&
			options.push({ label: 'EM', value: 'em' });
		allowedUnits.includes('vw') &&
			options.push({ label: 'VW', value: 'vw' });
		allowedUnits.includes('%') && options.push({ label: '%', value: '%' });
		return options;
	};

	const getKey = key => {
		return `${prefix}${target}-${key}${auxTarget ? `-${auxTarget}` : ''}`;
	};

	const getLastBreakpointValue = (key, customBreakpoint) => {
		const inputValue = getLastBreakpointAttribute({
			target: getKey(key),
			breakpoint: customBreakpoint ?? breakpoint,
			attributes: props,
			isHover,
			forceSingle: false,
			avoidXXL: true,
		});

		return inputValue;
	};

	const getValue = (key, customBreakpoint) => {
		let value;

		if (breakpoint === 'general' || customBreakpoint === 'general') {
			const baseBreakpoint = select('maxiBlocks').receiveBaseBreakpoint();

			value =
				props[
					getAttributeKey(getKey(key), isHover, false, baseBreakpoint)
				];
		}
		if (isNil(value)) {
			value =
				props[
					getAttributeKey(
						getKey(key),
						isHover,
						false,
						customBreakpoint ?? breakpoint
					)
				];
		}

		if (isNumber(value) || value) return value;

		return '';
	};

	const onReset = ({ customBreakpoint, reset }) => {
		const response = {
			isReset: true,
		};

		const attributesKeysFilter = rawKeys => {
			const keys = isArray(rawKeys) ? rawKeys : [rawKeys];

			const filteredResult = inputsArray.filter(input =>
				keys.some(
					key =>
						input === key ||
						(input.includes(key) && input.includes('-unit'))
				)
			);

			return filteredResult;
		};

		const getValueByBreakpoint = (key, breakpoint) => {
			const attrLabel = getAttributeKey(
				getKey(key),
				isHover,
				false,
				breakpoint
			);

			const value =
				defaultAttributes && attrLabel in defaultAttributes
					? defaultAttributes[attrLabel]
					: getDefaultAttribute(attrLabel);

			return value;
		};

		const getDefaultValue = key => {
			let value;

			if (breakpoint === 'general' || customBreakpoint === 'general') {
				const baseBreakpoint =
					select('maxiBlocks').receiveBaseBreakpoint();
				value = getValueByBreakpoint(key, baseBreakpoint);
			}
			if (isNil(value))
				value = getValueByBreakpoint(
					key,
					customBreakpoint ?? breakpoint
				);

			return value;
		};

		const top = inputsArray[0];
		const right = inputsArray[1];
		const bottom = inputsArray[2];
		const left = inputsArray[3];

		const cases = {
			all: [top, bottom, left, right],
			vertical: showAllSides ? getPairSides('vertical') : [top, bottom],
			horizontal: showAllSides
				? getPairSides('horizontal')
				: [left, right],
			top,
			right,
			bottom,
			left,
			[top]: top,
			[right]: right,
			[bottom]: bottom,
			[left]: left,
			unit: ['unit'],
		};

		const attributesKeys = cases[reset]
			? attributesKeysFilter(cases[reset])
			: [...inputsArray];

		attributesKeys.forEach(key => {
			response[
				getAttributeKey(
					getKey(key),
					isHover,
					false,
					customBreakpoint ?? breakpoint
				)
			] = getDefaultValue(key);
		});

		if (showAllSides) {
			const syncKeys = {
				all: ['sync', 'sync-vertical', 'sync-horizontal'],
				vertical: ['sync-vertical'],
				horizontal: ['sync-horizontal'],
			};

			syncKeys[reset]?.forEach(key => {
				response[
					getAttributeKey(
						getKey(key),
						isHover,
						false,
						customBreakpoint ?? breakpoint
					)
				] = getDefaultValue(key);
			});
		}

		onChange(response);
	};

	const onChangeSync = (value, customBreakpoint) => {
		const response = {
			[getAttributeKey(
				getKey('sync'),
				isHover,
				false,
				customBreakpoint ?? breakpoint
			)]: value,
		};

		onChange(response);
	};

	const currentUnit =
		getLastBreakpointAttribute({
			target: getKey('unit'),
			breakpoint,
			attributes: props,
			isHover,
		}) || 'px';

	const getPairSides = pair =>
		auxTarget === 'radius'
			? pair === 'vertical'
				? [inputsArray[0], inputsArray[1]]
				: [inputsArray[3], inputsArray[2]]
			: pair === 'vertical'
			? [inputsArray[0], inputsArray[2]]
			: [inputsArray[3], inputsArray[1]];

	const getPairForSide = side =>
		getPairSides('vertical').includes(side) ? 'vertical' : 'horizontal';

	const usesSharedUnitInInputs = showAllSides && auxTarget === 'radius';

	const getAllSides = () => inputsArray.slice(0, 4);

	const hasAxisValue = value => !isNil(value) && value !== '';

	// Keep default-linked new controls from overwriting older saved sides.
	const valuesCanSync = (sides, customBreakpoint) => {
		const values = sides.map(side => getValue(side, customBreakpoint));
		const valuesWithContent = values.filter(hasAxisValue);

		if (valuesWithContent.length === 0) return true;
		if (valuesWithContent.length !== values.length) return false;

		const firstValue = valuesWithContent[0];

		return valuesWithContent.every(value => `${value}` === `${firstValue}`);
	};

	const getSyncValue = (key, customBreakpoint) =>
		getLastBreakpointAttribute({
			target: getKey(key),
			breakpoint: customBreakpoint ?? breakpoint,
			attributes: props,
			isHover,
		});

	const getAllSyncValue = customBreakpoint => {
		const rawSync = getSyncValue('sync', customBreakpoint);

		return (
			showAllSides &&
			!isNil(rawSync) &&
			(rawSync === 'all' || rawSync === true) &&
			valuesCanSync(getAllSides(), customBreakpoint)
		);
	};

	const getPairSyncValue = (pair, customBreakpoint) => {
		const rawSync = getSyncValue(`sync-${pair}`, customBreakpoint);

		return (
			!isNil(rawSync) &&
			rawSync === true &&
			valuesCanSync(getPairSides(pair), customBreakpoint)
		);
	};

	const onChangePairSync = (pair, isSynced, customBreakpoint) => {
		const response = {
			[getAttributeKey(
				getKey(`sync-${pair}`),
				isHover,
				false,
				customBreakpoint ?? breakpoint
			)]: isSynced,
		};

		if (showAllSides) {
			response[
				getAttributeKey(
					getKey('sync'),
					isHover,
					false,
					customBreakpoint ?? breakpoint
				)
			] = 'none';
		}

		if (isSynced) {
			const pairSides = getPairSides(pair);
			const firstValue = getValue(pairSides[0], customBreakpoint);
			const secondValue = getValue(pairSides[1], customBreakpoint);
			const source =
				!isEmpty(firstValue) || isNumber(firstValue)
					? pairSides[0]
					: pairSides[1];
			const sourceValue =
				source === pairSides[0] ? firstValue : secondValue;
			const sourceUnit = usesSharedUnitInInputs
				? getLastBreakpointValue('unit', customBreakpoint) ||
				  currentUnit
				: getLastBreakpointValue(`${source}-unit`, customBreakpoint) ||
				  currentUnit;

			if (usesSharedUnitInInputs) {
				response[
					getAttributeKey(
						getKey('unit'),
						isHover,
						false,
						customBreakpoint ?? breakpoint
					)
				] = sourceUnit;
			}

			pairSides.forEach(side => {
				response[
					getAttributeKey(
						getKey(side),
						isHover,
						false,
						customBreakpoint ?? breakpoint
					)
				] = sourceValue;

				if (enableAxisUnits && !usesSharedUnitInInputs) {
					response[
						getAttributeKey(
							getKey(`${side}-unit`),
							isHover,
							false,
							customBreakpoint ?? breakpoint
						)
					] = sourceUnit;
				}
			});
		}

		onChange(response);
	};

	const onChangeAllSync = (isSynced, customBreakpoint) => {
		const response = {
			[getAttributeKey(
				getKey('sync'),
				isHover,
				false,
				customBreakpoint ?? breakpoint
			)]: isSynced ? 'all' : 'none',
		};

		if (isSynced) {
			const allSides = getAllSides();
			const source =
				allSides.find(side => {
					const sideValue = getValue(side, customBreakpoint);
					return !isEmpty(sideValue) || isNumber(sideValue);
				}) || allSides[0];
			const sourceValue = getValue(source, customBreakpoint);
			const sourceUnit = usesSharedUnitInInputs
				? getLastBreakpointValue('unit', customBreakpoint) ||
				  currentUnit
				: getLastBreakpointValue(`${source}-unit`, customBreakpoint) ||
				  currentUnit;

			response[
				getAttributeKey(
					getKey('sync-vertical'),
					isHover,
					false,
					customBreakpoint ?? breakpoint
				)
			] = true;
			response[
				getAttributeKey(
					getKey('sync-horizontal'),
					isHover,
					false,
					customBreakpoint ?? breakpoint
				)
			] = true;

			if (usesSharedUnitInInputs) {
				response[
					getAttributeKey(
						getKey('unit'),
						isHover,
						false,
						customBreakpoint ?? breakpoint
					)
				] = sourceUnit;
			}

			allSides.forEach(side => {
				response[
					getAttributeKey(
						getKey(side),
						isHover,
						false,
						customBreakpoint ?? breakpoint
					)
				] = sourceValue;

				if (enableAxisUnits && !usesSharedUnitInInputs) {
					response[
						getAttributeKey(
							getKey(`${side}-unit`),
							isHover,
							false,
							customBreakpoint ?? breakpoint
						)
					] = sourceUnit;
				}
			});
		}

		onChange(response);
	};

	const onChangeValue = (
		val,
		singleTarget,
		customBreakpoint,
		prefix,
		meta
	) => {
		let newValue = '';
		if (optionType === 'number' && isNaN(val))
			if (isEmpty(val)) newValue = val;
			else newValue = +val;
		else if (isEmpty(val) && !isNumber(val)) newValue = '';
		else if (val === 'auto') newValue = 'auto';
		else if (optionType === 'string') newValue = val.toString();
		else newValue = val;

		if (target === 'padding' && newValue < 0) newValue = 0;

		const sync = getLastBreakpointAttribute({
			target: getKey('sync'),
			breakpoint,
			attributes: props,
			isHover,
		});

		let response = {};

		if (showAllSides) {
			const pair = getPairForSide(singleTarget);
			const keysToUpdate =
				getAllSyncValue(customBreakpoint)
					? getAllSides()
					: getPairSyncValue(pair, customBreakpoint)
					? getPairSides(pair)
					: [singleTarget];

			keysToUpdate.forEach(key => {
				response[
					getAttributeKey(
						getKey(`${key}${prefix || ''}`),
						isHover,
						false,
						customBreakpoint ?? breakpoint
					)
				] = newValue;
			});

			onChange({ ...response, meta });
			return;
		}

		const isAllChange = key => {
			if (prefix) {
				return disableLeftRightMargin
					? key.includes(`top${prefix}`) ||
							key.includes(`bottom${prefix}`)
					: key.includes(`top${prefix}`) ||
							key.includes(`left${prefix}`) ||
							key.includes(`bottom${prefix}`) ||
							key.includes(`right${prefix}`);
			}
			return disableLeftRightMargin
				? (key.includes('top') || key.includes('bottom')) &&
						!key.includes('unit')
				: (key.includes('top') ||
						key.includes('left') ||
						key.includes('bottom') ||
						key.includes('right')) &&
						!key.includes('unit');
		};

		const isHorizontalChange = key => {
			if (prefix) {
				return [
					`left${prefix}`,
					`right${prefix}`,
					'bottom-left',
					'top-right',
				].includes(key);
			}
			return (
				['left', 'right', 'bottom-left', 'top-right'].includes(key) &&
				!key.includes('unit')
			);
		};

		const isVerticalChange = key => {
			if (prefix) {
				return [
					`top${prefix}`,
					`bottom${prefix}`,
					'top-left',
					'bottom-right',
				].includes(key);
			}
			return (
				['top', 'bottom', 'top-left', 'bottom-right'].includes(key) &&
				!key.includes('unit')
			);
		};

		switch (disableSync ? 'all' : sync) {
			case 'all': {
				inputsArray.forEach(key => {
					if (isAllChange(key)) {
						response[
							getAttributeKey(
								getKey(key),
								isHover,
								false,
								customBreakpoint ?? breakpoint
							)
						] = newValue;
					}
				});

				break;
			}
			case 'axis': {
				if (singleTarget === 'horizontal') {
					inputsArray.forEach(key => {
						if (isHorizontalChange(key)) {
							response[
								getAttributeKey(
									getKey(key),
									isHover,
									false,
									customBreakpoint ?? breakpoint
								)
							] = newValue;
						}
					});
				} else if (singleTarget === 'vertical') {
					inputsArray.forEach(key => {
						if (isVerticalChange(key)) {
							response[
								getAttributeKey(
									getKey(key),
									isHover,
									false,
									customBreakpoint ?? breakpoint
								)
							] = newValue;
						}
					});
				}

				break;
			}
			case 'none':
			default: {
				response = {
					...(prefix
						? {
								[getAttributeKey(
									getKey(`${singleTarget}${prefix}`),
									isHover,
									false,
									customBreakpoint ?? breakpoint
								)]: newValue,
						  }
						: {
								[getAttributeKey(
									getKey(`${singleTarget}`),
									isHover,
									false,
									customBreakpoint ?? breakpoint
								)]: newValue,
						  }),
				};

				break;
			}
		}

		onChange({ ...response, meta });
	};

	return (
		<div className={classes}>
			{useResponsiveTabs && (
				<ResponsiveTabsControl breakpoint={breakpoint} target={target}>
					<AxisControlContent
						{...props}
						key='AxisControlContent__responsive'
						label={label}
						getOptions={getOptions}
						currentUnit={currentUnit}
						target={target}
						isHover={isHover}
						onChange={onChange}
						onReset={onReset}
						inputsArray={inputsArray}
						getLastBreakpointValue={getLastBreakpointValue}
						getValue={getValue}
						onChangeValue={onChangeValue}
						minMaxSettings={minMaxSettings}
						disableAuto={disableAuto}
						disableLeftRightMargin={disableLeftRightMargin}
						getKey={getKey}
						onChangeSync={onChangeSync}
						onChangeUnit={onChangeValue}
						enableAxisUnits={enableAxisUnits}
						showAllSides={showAllSides}
						getPairSyncValue={getPairSyncValue}
						getAllSyncValue={getAllSyncValue}
						getPairForSide={getPairForSide}
						onChangePairSync={onChangePairSync}
						onChangeAllSync={onChangeAllSync}
					/>
				</ResponsiveTabsControl>
			)}
			{!useResponsiveTabs && (
				<AxisControlContent
					{...props}
					key='AxisControlContent__non-responsive'
					label={label}
					getOptions={getOptions}
					currentUnit={currentUnit}
					target={target}
					isHover={isHover}
					onChange={onChange}
					onReset={onReset}
					inputsArray={inputsArray}
					getLastBreakpointValue={getLastBreakpointValue}
					getValue={getValue}
					onChangeValue={onChangeValue}
					minMaxSettings={minMaxSettings}
					disableAuto={disableAuto}
					getKey={getKey}
					onChangeSync={onChangeSync}
					onChangeUnit={onChangeValue}
					enableAxisUnits={enableAxisUnits}
					showAllSides={showAllSides}
					getPairSyncValue={getPairSyncValue}
					getAllSyncValue={getAllSyncValue}
					getPairForSide={getPairForSide}
					onChangePairSync={onChangePairSync}
					onChangeAllSync={onChangeAllSync}
				/>
			)}
		</div>
	);
};

export default AxisControl;

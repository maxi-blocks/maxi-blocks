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
	} = props;

	const value = getValue(target, breakpoint);
	const lastValue = getLastBreakpointValue(target);

	const unit = getLastBreakpointValue(`${target}-unit`, breakpoint);

	const isAxisMode =
		singleTarget === 'vertical' || singleTarget === 'horizontal';

	return (
		<AdvancedNumberControl
			label={__(capitalize(label), 'maxi-blocks')}
			className={classnames(
				'maxi-axis-control__content__item',
				`maxi-axis-control__content__item__${kebabCase(label)}`,
				extraClassName
			)}
			placeholder={lastValue}
			value={value}
			onChangeValue={val => onChangeValue(val, singleTarget, breakpoint)}
			minMaxSettings={minMaxSettings}
			enableAuto={!disableAuto}
			autoLabel={__(`Auto ${label.toLowerCase()}`, 'maxi-blocks')}
			classNameAutoInput={classnames(
				'maxi-axis-control__item-auto',
				isAxisMode && 'maxi-axis-control__item-auto--axis-mode'
			)}
			enableUnit={enableAxisUnits}
			min={minMaxSettings[currentUnit].min || 0}
			max={minMaxSettings[currentUnit].max || 999}
			step={minMaxSettings[currentUnit].step || 1}
			onChangeUnit={val =>
				onChangeUnit(val, singleTarget, breakpoint, '-unit')
			}
			unit={unit}
			onReset={onReset}
			disableRange={disableRange}
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

	return (
		<div className={getContainerClass()} data-sync={sync}>
			{(sync === 'all' || disableSync) && (
				<AxisInput
					label={type}
					target={inputsArray[0]}
					getValue={getValue}
					getLastBreakpointValue={getLastBreakpointValue}
					breakpoint={breakpoint}
					disableAuto={disableAuto}
					onChangeValue={onChangeValue}
					minMaxSettings={minMaxSettings}
					currentUnit={currentUnit}
					type={type}
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
	} = props;

	const sync = getLastBreakpointAttribute({
		target: getKey('sync'),
		breakpoint,
		attributes: props,
		isHover,
	});

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

	return (
		<>
			{!disableSync && (
				<>
					{!enableAxisUnits && (
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
					)}
					<SettingTabsControl
						label={getSyncLabel()}
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
								value: 'none',
								className: 'maxi-axis-control__sync-none',
								icon:
									type === 'Margin'
										? marginSeparateIcon
										: paddingSeparateIcon,
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
								value: 'all',
								className: 'maxi-axis-control__sync-all',
								icon:
									type === 'Margin'
										? marginSyncAllIcon
										: paddingSyncAllIcon,
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
	} = props;

	const classes = classnames(
		'maxi-axis-control',
		target && `maxi-axis-control__${target}`,
		disableAuto && 'maxi-axis-control__disable-auto',
		className
	);

	const useResponsiveTabs =
		!noResponsiveTabs && ['margin', 'padding'].includes(target);

	const disableLeftRightMargin = target === 'margin' && fullWidth;

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

	const getLastBreakpointValue = key => {
		const inputValue = getLastBreakpointAttribute({
			target: getKey(key),
			breakpoint,
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
			vertical: [top, bottom],
			horizontal: [left, right],
			top,
			right,
			bottom,
			left,
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

	const onChangeValue = (val, singleTarget, customBreakpoint, prefix) => {
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

		onChange(response);
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
				/>
			)}
		</div>
	);
};

export default AxisControl;

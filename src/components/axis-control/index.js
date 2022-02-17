/* eslint-disable @wordpress/i18n-no-collapsible-whitespace */
/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import AdvancedNumberControl from '../advanced-number-control';
import BaseControl from '../base-control';
import Button from '../button';
import SettingTabsControl from '../setting-tabs-control';
import SelectControl from '../select-control';
import ResponsiveTabsControl from '../responsive-tabs-control';
import {
	getLastBreakpointAttribute,
	getDefaultAttribute,
	getAttributeKey,
} from '../../extensions/styles';

/**
 * External dependencies
 */
import classnames from 'classnames';
import {
	isEmpty,
	capitalize,
	isNumber,
	replace,
	round,
	isNil,
	isNaN,
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
	reset,
} from '../../icons';

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
	} = props;

	const value = getValue(target, breakpoint);
	const lastValue = getLastBreakpointValue(target);

	return (
		<AdvancedNumberControl
			label={__(capitalize(label), 'maxi-blocks')}
			className={classnames(
				'maxi-axis-control__content__item',
				`maxi-axis-control__content__item__${replace(
					label,
					' / ',
					'-'
				).toLowerCase()}`
			)}
			placeholder={lastValue}
			value={value}
			onChangeValue={val => onChangeValue(val, singleTarget, breakpoint)}
			minMaxSettings={minMaxSettings}
			enableAuto={!disableAuto}
			autoLabel={__(`Auto ${label}`, 'maxi-blocks')}
			classNameAutoInput='maxi-axis-control__item-auto'
			disableReset
			min={minMaxSettings[currentUnit].min || 0}
			max={minMaxSettings[currentUnit].max || 999}
			step={minMaxSettings[currentUnit].step || 1}
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
		label: type,
	} = props;

	const sync = getLastBreakpointAttribute(
		getKey('sync'),
		breakpoint,
		props,
		isHover
	);

	return (
		<div>
			{sync === 'all' && (
				<>
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
					/>
				</>
			)}
			{sync === 'axis' && (
				<>
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
					/>
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
					/>
				</>
			)}
			{sync === 'none' && (
				<>
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
					/>
					<AxisInput
						label={inputsArray[1]}
						target={inputsArray[1]}
						singleTarget={inputsArray[1]}
						getValue={getValue}
						getLastBreakpointValue={getLastBreakpointValue}
						breakpoint={breakpoint}
						disableAuto={disableAuto}
						onChangeValue={onChangeValue}
						minMaxSettings={minMaxSettings}
						currentUnit={currentUnit}
						type={type}
					/>
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
					/>
					<AxisInput
						label={inputsArray[3]}
						target={inputsArray[3]}
						singleTarget={inputsArray[3]}
						getValue={getValue}
						getLastBreakpointValue={getLastBreakpointValue}
						breakpoint={breakpoint}
						disableAuto={disableAuto}
						onChangeValue={onChangeValue}
						minMaxSettings={minMaxSettings}
						currentUnit={currentUnit}
						type={type}
					/>
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
	} = props;

	const sync = getLastBreakpointAttribute(
		getKey('sync'),
		breakpoint,
		props,
		isHover
	);

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
				const value = getLastBreakpointAttribute(
					getKey(input),
					breakpoint,
					props,
					isHover
				);

				if (!isNil(value) && !isNaN(value))
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
			<BaseControl
				label={__(type, 'maxi-blocks')}
				className='maxi-axis-control__unit-header'
			>
				<SelectControl
					className='maxi-axis-control__units'
					hideLabelFromVision
					label={__('Unit', 'maxi-blocks')}
					options={getOptions()}
					value={currentUnit}
					onChange={onChangeUnit}
				/>
				<Button
					className='components-maxi-control__reset-button'
					onClick={() => onReset(breakpoint)}
					aria-label={sprintf(
						__('Reset %s settings', 'maxi-blocks'),
						type.toLowerCase()
					)}
					action='reset'
					type='reset'
				>
					{reset}
				</Button>
			</BaseControl>
			<SettingTabsControl
				label={getSyncLabel()}
				type='buttons'
				className='maxi-axis-control__header'
				selected={sync}
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
						className: 'maxi-axis-control__sync-axis',
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
			'unit',
			'sync',
			'sync-horizontal',
			'sync-vertical',
		],
		optionType = 'number',
	} = props;

	const classes = classnames(
		'maxi-axis-control',
		target && `maxi-axis-control__${target}`,
		disableAuto && 'maxi-axis-control__disable-auto',
		className
	);

	const useResponsiveTabs = ['margin', 'padding'].includes(target);

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
		const inputValue = getLastBreakpointAttribute(
			getKey(key),
			breakpoint,
			props,
			isHover,
			false,
			true
		);

		return inputValue;
	};

	const getValue = (key, customBreakpoint) => {
		const value =
			props[
				getAttributeKey(
					getKey(key),
					isHover,
					false,
					customBreakpoint ?? breakpoint
				)
			];

		if (isNumber(value) || value) return value;

		return '';
	};

	const onReset = customBreakpoint => {
		const response = {};

		inputsArray.forEach(key => {
			response[
				getAttributeKey(
					getKey(key),
					isHover,
					false,
					customBreakpoint ?? breakpoint
				)
			] = getDefaultAttribute(
				getAttributeKey(
					getKey(key),
					isHover,
					false,
					customBreakpoint ?? breakpoint
				)
			);
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
		getLastBreakpointAttribute(
			getKey('unit'),
			breakpoint,
			props,
			isHover
		) || 'px';

	const onChangeValue = (val, singleTarget, customBreakpoint) => {
		let newValue = '';

		if (optionType === 'number')
			if (isEmpty(val)) newValue = val;
			else newValue = +val;
		else if (isEmpty(val) && !isNumber(val)) newValue = '';
		else if (val === 'auto') newValue = 'auto';
		else if (optionType === 'string') newValue = val.toString();
		else newValue = val;

		if (target === 'padding' && newValue < 0) newValue = 0;

		const sync = getLastBreakpointAttribute(
			getKey('sync'),
			breakpoint,
			props,
			isHover
		);

		let response = {};

		switch (sync) {
			case 'all': {
				inputsArray.forEach(key => {
					if (
						key.includes('top') ||
						key.includes('left') ||
						key.includes('bottom') ||
						key.includes('right')
					) {
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
						if (
							[
								'left',
								'right',
								'bottom-left',
								'top-right',
							].includes(key)
						) {
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
						if (
							[
								'top',
								'bottom',
								'top-left',
								'bottom-right',
							].includes(key)
						) {
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
					[getAttributeKey(
						getKey(singleTarget),
						isHover,
						false,
						customBreakpoint ?? breakpoint
					)]: newValue,
				};

				break;
			}
		}

		onChange(response);
	};

	return (
		<div className={classes}>
			{useResponsiveTabs && (
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
					getKey={getKey}
					onChangeSync={onChangeSync}
				/>
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
				/>
			)}
		</div>
	);
};

export default AxisControl;

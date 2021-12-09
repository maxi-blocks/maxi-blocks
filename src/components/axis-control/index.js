/* eslint-disable @wordpress/i18n-no-collapsible-whitespace */
/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import BaseControl from '../base-control';
import Button from '../button';
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
import { isEmpty, capitalize, isNumber, replace } from 'lodash';

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
import { ButtonGroupControl, AdvancedNumberControl } from '..';

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
		isGeneral,
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
			onChangeValue={val =>
				onChangeValue(val, singleTarget, isGeneral, breakpoint)
			}
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
		isGeneral,
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
						isGeneral={isGeneral}
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
						isGeneral={isGeneral}
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
						isGeneral={isGeneral}
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
						isGeneral={isGeneral}
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
						isGeneral={isGeneral}
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
						isGeneral={isGeneral}
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
						isGeneral={isGeneral}
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
		isGeneral,
		onChangeSync,
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
					onChange={val =>
						onChange({
							[getAttributeKey(
								getKey('unit'),
								isHover,
								false,
								breakpoint
							)]: val,
							...(isGeneral && {
								[getAttributeKey(
									getKey('unit'),
									isHover,
									false,
									'general'
								)]: val,
							}),
						})
					}
				/>
				<Button
					className='components-maxi-control__reset-button'
					onClick={() => onReset(isGeneral, breakpoint)}
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
			<ButtonGroupControl
				label={getSyncLabel()}
				className='maxi-axis-control__header'
				selected={sync}
				options={[
					{
						value: 'all',
						className: 'maxi-axis-control__sync-all',
						label:
							type === 'Margin'
								? marginSyncAllIcon
								: paddingSyncAllIcon,
					},
					{
						value: 'axis',
						className: 'maxi-axis-control__sync-axis',
						label:
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
				onChange={val => onChangeSync(val, isGeneral, breakpoint)}
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

	const onReset = (isGeneral, customBreakpoint) => {
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

			if (isGeneral)
				response[
					getAttributeKey(getKey(key), isHover, false, 'general')
				] = getDefaultAttribute(
					getAttributeKey(getKey(key), isHover, false, 'general')
				);
		});

		onChange(response);
	};

	const onChangeSync = (value, isGeneral = false, customBreakpoint) => {
		const response = {
			[getAttributeKey(
				getKey('sync'),
				isHover,
				false,
				customBreakpoint ?? breakpoint
			)]: value,
			...(isGeneral && {
				[getAttributeKey(getKey('sync'), isHover, false, 'general')]:
					value,
			}),
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

	const onChangeValue = (
		val,
		singleTarget,
		isGeneral = false,
		customBreakpoint
	) => {
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

						if (isGeneral)
							response[
								getAttributeKey(
									getKey(key),
									isHover,
									false,
									'general'
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

							if (isGeneral)
								response[
									getAttributeKey(
										getKey(key),
										isHover,
										false,
										'general'
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

							if (isGeneral)
								response[
									getAttributeKey(
										getKey(key),
										isHover,
										false,
										'general'
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
					...(isGeneral && {
						[getAttributeKey(
							getKey(singleTarget),
							isHover,
							false,
							'general'
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
				<ResponsiveTabsControl breakpoint={breakpoint}>
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
				/>
			)}
		</div>
	);
};

export default AxisControl;

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { RangeControl } from '@wordpress/components';
import { useInstanceId, useDebounce } from '@wordpress/compose';
import { useEffect, useState, useRef, useCallback } from '@wordpress/element';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isEmpty, isNumber, merge, trim } from 'lodash';

/**
 * Internal dependencies
 */
import SelectControl from '@components/select-control';
import BaseControl from '@components/base-control';
import ToggleSwitch from '@components/toggle-switch';
import ResetButton from '@components/reset-control';
import validateNumberInput from './utils';

/**
 * Styles
 */
import './editor.scss';
import { getIsValid } from '@extensions/styles';

/**
 * Component
 */
const AdvancedNumberControl = props => {
	const minMaxSettingsDefault = {
		px: {
			min: 0,
			max: 3999,
			minRange: -1999,
			maxRange: 1999,
		},
		em: {
			min: 0,
			max: 999,
			minRange: -300,
			maxRange: 300,
		},
		rem: {
			min: 0,
			max: 999,
			minRange: -300,
			maxRange: 300,
		},
		vw: {
			min: 0,
			max: 999,
			minRange: -300,
			maxRange: 300,
		},
		vh: {
			min: 0,
			max: 999,
			minRange: -300,
			maxRange: 300,
		},
		'%': {
			min: 0,
			max: 100,
			minRange: -100,
			maxRange: 100,
		},
		'-': {
			min: 0,
			max: 16,
			minRange: 0,
			maxRange: 16,
		},
	};

	const {
		label = '',
		className,
		classNameAutoInput,
		unit = 'px',
		placeholder = '',
		onChangeUnit,
		enableUnit = false,
		disableInputsLimits = false,
		min = 0,
		max = 999,
		maxRange,
		initial = 0,
		step = 1,
		defaultValue = '',
		value,
		onChangeValue,
		disableReset = false,
		disableRange = false,
		enableAuto = false,
		autoLabel,
		onReset,
		resetButtonClassName,
		resetButtonSize = 'default', // 'small', 'default', 'large'
		allowedUnits = ['px', 'em', 'vw', 'vh', '%', '-'],
		minMaxSettings = minMaxSettingsDefault,
		optionType = 'number',
		inputType = 'number',
		customValidationRegex,
		transformRangePreferredValue,
		newStyle = false,
		showHelp = false,
		helpContent = '',
	} = props;

	const [currentValue, setCurrentValue] = useState(
		value === undefined ? defaultValue : trim(value)
	);

	const latestValueRef = useRef(currentValue);

	useEffect(() => {
		const formattedValue =
			typeof value === 'number'
				? parseFloat(value.toFixed(10))
				: trim(value);

		setCurrentValue(formattedValue);
		latestValueRef.current =
			typeof value === 'number' ? value.toString() : trim(value);
	}, [value]);

	const classes = classnames(
		`maxi-advanced-number-control ${
			newStyle ? 'maxi-advanced-number-control__second-style' : ''
		}`,
		className
	);

	const stepValue = unit === '-' || isEmpty(unit) ? 0.01 : step;

	const advancedNumberControlId = `maxi-advanced-number-control__${useInstanceId(
		AdvancedNumberControl
	)}`;

	const getOptions = () => {
		const options = [];

		allowedUnits.forEach(unit => {
			// In case allowedUnits is not defined but minMaxSettings is
			// with less than default allowedUnit items, it takes minMaxSettings
			// as the one which checks if some unit is allowed
			if (unit in minMaxSettings)
				options.push({ label: unit.toUpperCase(), value: unit });
		});

		return options;
	};

	const minMaxSettingsResult = merge(minMaxSettingsDefault, minMaxSettings);

	const minValue = minMaxSettingsResult[isEmpty(unit) ? '-' : unit]?.min;
	const maxValue = minMaxSettingsResult[isEmpty(unit) ? '-' : unit]?.max;

	const minValueRange =
		minMaxSettingsResult[isEmpty(unit) ? '-' : unit]?.minRange < minValue ||
		disableInputsLimits
			? minValue
			: minMaxSettingsResult[isEmpty(unit) ? '-' : unit]?.minRange;

	const maxValueRange =
		minMaxSettingsResult[isEmpty(unit) ? '-' : unit]?.maxRange > maxValue ||
		disableInputsLimits
			? maxValue
			: minMaxSettingsResult[isEmpty(unit) ? '-' : unit]?.maxRange;

	const getNewValueFromEmpty = e => {
		const {
			nativeEvent: { inputType },
			target: { value: newValue },
		} = e;

		if (isNumber(currentValue)) return newValue;

		const typeofEvent = getIsValid(inputType, true) ? 'type' : 'click';

		switch (typeofEvent) {
			case 'click':
				return (
					(isNumber(+placeholder) && isEmpty(currentValue)
						? +placeholder
						: 0) + +newValue
				);
			case 'type':
			default:
				return newValue;
		}
	};

	const handleChange = useDebounce(
		useCallback((onChangeValue, latestValueRef, optionType) => {
			if (onChangeValue) {
				const val =
					latestValueRef.current === '' || optionType === 'string'
						? latestValueRef.current.toString()
						: +latestValueRef.current;
				onChangeValue(val);
			}
		}, []),
		300
	);

	const handleInputChange = e => {
		let value = getNewValueFromEmpty(e);

		if (enableUnit) {
			if (value !== '' && value > maxValue) value = maxValue;
			if (value !== '' && value < minValue) value = minValue;
		} else {
			if (value !== '' && +value > max) value = max;
			if (value !== '' && +value !== 0 && +value < min) value = min;
		}

		let result;
		if (value === '' || optionType === 'string') {
			result = value.toString();
		} else {
			// Fix floating-point precision
			const numValue = +value;
			result = parseFloat(numValue.toFixed(10));
		}

		latestValueRef.current =
			typeof result === 'number' ? result.toString() : result;
		setCurrentValue(result);

		const val =
			result === '' || optionType === 'string'
				? result.toString()
				: +result;
		onChangeValue?.(val, { inline: enableUnit ? { unit } : {} });

		handleChange(onChangeValue, latestValueRef, optionType);
	};

	const rawPreferredValues = [
		latestValueRef.current,
		currentValue,
		value,
		defaultValue,
		initial,
		placeholder,
	];

	const preferredValues = transformRangePreferredValue
		? rawPreferredValues.map(transformRangePreferredValue)
		: rawPreferredValues;

	const rangeValue = +preferredValues.find(val => /\d/.test(val)) || null;

	const [showHelpContent, setShowHelpContent] = useState(false);

	const handleToggleHelpContent = () => {
		setShowHelpContent(state => !state);
	};

	return (
		<>
			{enableAuto && (
				<ToggleSwitch
					label={autoLabel || __('Auto', 'maxi-blocks')}
					className={classNameAutoInput}
					selected={value === 'auto'}
					onChange={val =>
						val ? onChangeValue?.('auto') : onReset?.()
					}
				/>
			)}
			<BaseControl
				__nextHasNoMarginBottom
				id={advancedNumberControlId}
				label={typeof label === 'string' ? label : ''}
				className={classes}
			>
				{showHelp && (
					<div
						className='maxi-info__help-icon'
						onClick={handleToggleHelpContent}
					>
						<span className='maxi-info__help-icon-span'>i</span>
					</div>
				)}
				{showHelpContent && helpContent}
				{value !== 'auto' && (
					<div className='maxi-advanced-number-control__controls-group'>
						<div className='maxi-advanced-number-control__input-wrapper'>
							<input
								id={advancedNumberControlId}
								type={
									!enableAuto || value !== 'auto'
										? inputType
										: 'hidden'
								}
								className='maxi-advanced-number-control__value'
								value={latestValueRef.current || currentValue}
								onChange={handleInputChange}
								onKeyDown={e => {
									validateNumberInput(
										e,
										customValidationRegex
									);
									if (
										e.key === '-' &&
										(enableUnit ? minValue : min) >= 0
									) {
										e.preventDefault();
									}
								}}
								min={enableUnit ? minValue : min}
								max={enableUnit ? maxValue : max}
								step={stepValue}
								placeholder={placeholder}
							/>
							<div className='maxi-advanced-number-control__spinner-container'>
								<button
									type='button'
									className='maxi-advanced-number-control__spinner-button maxi-advanced-number-control__spinner-button--up'
									disabled={(() => {
										const currentVal =
											parseFloat(
												latestValueRef.current
											) ||
											parseFloat(placeholder) ||
											0;
										const maxVal = enableUnit
											? maxValue
											: max;
										return currentVal >= maxVal;
									})()}
									onClick={e => {
										e.preventDefault();
										const hasRealValue =
											latestValueRef.current !== '' &&
											latestValueRef.current !==
												undefined &&
											latestValueRef.current !== null;
										const currentVal = hasRealValue
											? parseFloat(latestValueRef.current)
											: parseFloat(placeholder) || 0;
										let newVal =
											currentVal + (stepValue || 1);

										// Fix floating-point precision issues
										const decimalPlaces = (
											stepValue
												.toString()
												.split('.')[1] || ''
										).length;
										newVal = parseFloat(
											newVal.toFixed(
												Math.max(decimalPlaces, 10)
											)
										);

										const maxVal = enableUnit
											? maxValue
											: max;
										if (newVal <= maxVal) {
											latestValueRef.current =
												newVal.toString();
											setCurrentValue(newVal);
											onChangeValue?.(newVal, {
												inline: enableUnit
													? { unit }
													: {},
											});
											handleChange(
												onChangeValue,
												latestValueRef,
												optionType
											);
										}
									}}
									title={__('Increase value', 'maxi-blocks')}
									aria-label={__(
										'Increase value',
										'maxi-blocks'
									)}
								>
									<svg
										width='8'
										height='5'
										viewBox='0 0 8 5'
										fill='none'
										xmlns='http://www.w3.org/2000/svg'
									>
										<path
											d='M1 4L4 1L7 4'
											stroke='currentColor'
											strokeWidth='1.5'
											strokeLinecap='round'
											strokeLinejoin='round'
										/>
									</svg>
								</button>
								<button
									type='button'
									className='maxi-advanced-number-control__spinner-button maxi-advanced-number-control__spinner-button--down'
									disabled={(() => {
										const currentVal =
											parseFloat(
												latestValueRef.current
											) ||
											parseFloat(placeholder) ||
											0;
										const minVal = enableUnit
											? minValue
											: min;
										return currentVal <= minVal;
									})()}
									onClick={e => {
										e.preventDefault();
										const hasRealValue =
											latestValueRef.current !== '' &&
											latestValueRef.current !==
												undefined &&
											latestValueRef.current !== null;
										const currentVal = hasRealValue
											? parseFloat(latestValueRef.current)
											: parseFloat(placeholder) || 0;
										let newVal =
											currentVal - (stepValue || 1);

										// Fix floating-point precision issues
										const decimalPlaces = (
											stepValue
												.toString()
												.split('.')[1] || ''
										).length;
										newVal = parseFloat(
											newVal.toFixed(
												Math.max(decimalPlaces, 10)
											)
										);

										const minVal = enableUnit
											? minValue
											: min;
										if (newVal >= minVal) {
											latestValueRef.current =
												newVal.toString();
											setCurrentValue(newVal);
											onChangeValue?.(newVal, {
												inline: enableUnit
													? { unit }
													: {},
											});
											handleChange(
												onChangeValue,
												latestValueRef,
												optionType
											);
										}
									}}
									title='Decrease value'
									aria-label='Decrease value'
								>
									<svg
										width='8'
										height='5'
										viewBox='0 0 8 5'
										fill='none'
										xmlns='http://www.w3.org/2000/svg'
									>
										<path
											d='M7 1L4 4L1 1'
											stroke='currentColor'
											strokeWidth='1.5'
											strokeLinecap='round'
											strokeLinejoin='round'
										/>
									</svg>
								</button>
							</div>
						</div>
						{enableUnit && (
							<SelectControl
								__nextHasNoMarginBottom
								hideLabelFromVision
								className='maxi-dimensions-control__units'
								options={getOptions()}
								value={unit}
								onChange={val => {
									if (
										Number(value) > minMaxSettings[val]?.max
									) {
										const clampedValue =
											optionType === 'string'
												? minMaxSettings[
														val
												  ]?.max.toString()
												: minMaxSettings[val]?.max;
										latestValueRef.current =
											clampedValue.toString();
										setCurrentValue(clampedValue);
										onChangeValue?.(clampedValue, {
											inline: { unit: val },
										});
										handleChange(
											onChangeValue,
											latestValueRef,
											optionType
										);
									}
									onChangeUnit?.(val);
								}}
							/>
						)}
						{!disableReset && (
							<ResetButton
								className={
									resetButtonClassName
										? `${resetButtonClassName} maxi-reset-button--typography`
										: 'maxi-reset-button--typography'
								}
								onReset={() => {
									setCurrentValue(defaultValue);
									latestValueRef.current = defaultValue;
									onChangeValue?.(defaultValue, {
										inline: enableUnit ? { unit } : {},
									});
									onReset?.();
								}}
								isSmall={resetButtonSize === 'small'}
								isLarge={resetButtonSize === 'large'}
								isAbsolute={
									resetButtonClassName ===
									'maxi-reset-button--absolute'
								}
							/>
						)}
					</div>
				)}

				{!disableRange && (
					<RangeControl
						label={label}
						className={`maxi-advanced-number-control__range${
							value > 11111
								? (value / max) * 100 <= 10
									? '--small'
									: (value / max) * 100 >= 90
									? '--big'
									: ''
								: ''
						}`}
						value={rangeValue ?? placeholder ?? 0}
						onChange={val => {
							let result =
								optionType === 'string' ? val.toString() : +val;

							// Fix floating-point precision issues for numeric values
							if (optionType !== 'string' && stepValue < 1) {
								const decimalPlaces = (
									stepValue.toString().split('.')[1] || ''
								).length;
								result = parseFloat(
									result.toFixed(Math.max(decimalPlaces, 10))
								);
							}

							setCurrentValue(result);
							latestValueRef.current = result;

							onChangeValue?.(result, {
								inline: enableUnit ? { unit } : {},
							});

							handleChange(
								onChangeValue,
								latestValueRef,
								optionType
							);
						}}
						min={enableUnit ? minValueRange : min}
						max={maxRange || (enableUnit ? maxValueRange : max)}
						step={stepValue}
						withInputField={false}
						initialPosition={value || initial}
						__nextHasNoMarginBottom
					/>
				)}
			</BaseControl>
		</>
	);
};

export default AdvancedNumberControl;

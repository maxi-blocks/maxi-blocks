/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { RangeControl } from '@wordpress/components';
import { useInstanceId } from '@wordpress/compose';
import { useEffect, useState, useRef, useMemo, useCallback } from '@wordpress/element';

/**
 * External dependencies
 */
import classnames from 'classnames';
import isEmpty from 'lodash/isEmpty';
import isNumber from 'lodash/isNumber';
import merge from 'lodash/merge';
import trim from 'lodash/trim';
import debounce from 'lodash/debounce';

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

	// Optimized debounced handler with reduced timing
	const handleChange = useMemo(
		() => debounce(() => {
			if (onChangeValue) {
				const val =
					latestValueRef.current === '' || optionType === 'string'
						? latestValueRef.current.toString()
						: +latestValueRef.current;
				onChangeValue(val);
			}
		}, 200), // Reduced from 300ms for snappier response
		[onChangeValue, optionType]
	);

	// Batched input change handler for smoother performance
	const handleInputChange = useCallback((e) => {
		let value = getNewValueFromEmpty(e);

		// Batch validation operations
		const limits = enableUnit ? { max: maxValue, min: minValue } : { max, min };
		
		if (value !== '' && value > limits.max) value = limits.max;
		if (value !== '' && value < limits.min && +value !== 0) value = limits.min;

		let result;
		if (value === '' || optionType === 'string') {
			result = value.toString();
		} else {
			// Fix floating-point precision with cached calculation
			const numValue = +value;
			result = parseFloat(numValue.toFixed(10));
		}

		// Batch state updates using React's automatic batching
		const stringResult = typeof result === 'number' ? result.toString() : result;
		latestValueRef.current = stringResult;
		setCurrentValue(result);
		
		// Debounced external change
		handleChange();
	}, [enableUnit, maxValue, minValue, max, min, optionType, handleChange]);

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

	const handleToggleHelpContent = useCallback(() => {
		setShowHelpContent(state => !state);
	}, []);

	// Memoize expensive spinner calculations
	const spinnerConfig = useMemo(() => {
		const currentVal = parseFloat(latestValueRef.current) || 0;
		const maxVal = enableUnit ? maxValue : max;
		const minVal = enableUnit ? minValue : min;
		const stepVal = stepValue || 1;
		
		return {
			currentVal,
			maxVal,
			minVal,
			stepVal,
			isMaxDisabled: currentVal >= maxVal,
			isMinDisabled: currentVal <= minVal,
			canIncrease: currentVal + stepVal <= maxVal,
			canDecrease: currentVal - stepVal >= minVal
		};
	}, [latestValueRef.current, enableUnit, maxValue, max, minValue, min, stepValue]);

	// Optimized spinner handlers
	const handleSpinnerUp = useCallback((e) => {
		e.preventDefault();
		const { currentVal, stepVal, maxVal } = spinnerConfig;
		const newVal = currentVal + stepVal;
		
		if (newVal <= maxVal) {
			latestValueRef.current = newVal.toString();
			setCurrentValue(newVal);
			onChangeValue(newVal);
		}
	}, [spinnerConfig, onChangeValue]);

	const handleSpinnerDown = useCallback((e) => {
		e.preventDefault();
		const { currentVal, stepVal, minVal } = spinnerConfig;
		const newVal = currentVal - stepVal;
		
		if (newVal >= minVal) {
			latestValueRef.current = newVal.toString();
			setCurrentValue(newVal);
			onChangeValue(newVal);
		}
	}, [spinnerConfig, onChangeValue]);

	return (
		<>
			{enableAuto && (
				<ToggleSwitch
					label={autoLabel || __('Auto', 'maxi-blocks')}
					className={classNameAutoInput}
					selected={value === 'auto'}
					onChange={val => (val ? onChangeValue('auto') : onReset())}
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
					<>
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
									disabled={spinnerConfig.isMaxDisabled}
									onClick={handleSpinnerUp}
									title='Increase value'
									aria-label='Increase value'
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
									disabled={spinnerConfig.isMinDisabled}
									onClick={handleSpinnerDown}
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
									if (value > minMaxSettings[val]?.max) {
										onChangeValue(
											optionType === 'string'
												? minMaxSettings[
														val
												  ]?.max.toString()
												: minMaxSettings[val]?.max,
											val
										);
									}
									onChangeUnit(val);
								}}
							/>
						)}
					</>
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
							onChangeValue(defaultValue);
							onReset();
						}}
						isSmall={resetButtonSize === 'small'}
						isLarge={resetButtonSize === 'large'}
						isAbsolute={
							resetButtonClassName ===
							'maxi-reset-button--absolute'
						}
					/>
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
						onChange={useCallback(val => {
							const result = optionType === 'string' ? val.toString() : +val;
							// Batch state updates
							setCurrentValue(result);
							latestValueRef.current = result;
							onChangeValue(result);
						}, [optionType, onChangeValue])}
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

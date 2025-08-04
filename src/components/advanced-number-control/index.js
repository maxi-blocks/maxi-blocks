/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
// import { RangeControl } from '@wordpress/components'; // Temporarily disabled
import { useInstanceId } from '@wordpress/compose';
import { useEffect, useState, useRef } from '@wordpress/element';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isEmpty, isNumber, merge, trim, debounce } from 'lodash';

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
		// disableInputsLimits = false, // Temporarily disabled with range slider
		min = 0,
		max = 999,
		// maxRange, // Temporarily disabled with range slider
		// initial = 0, // Temporarily disabled with range slider
		step = 1,
		defaultValue = '',
		value,
		onChangeValue,
		disableReset = false,
		// disableRange = false, // Temporarily disabled with range slider
		enableAuto = false,
		autoLabel,
		onReset,
		resetButtonClassName,
		allowedUnits = ['px', 'em', 'vw', 'vh', '%', '-'],
		minMaxSettings = minMaxSettingsDefault,
		optionType = 'number',
		inputType = 'number',
		customValidationRegex,
		// transformRangePreferredValue, // Temporarily disabled with range slider
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

	// Temporarily disabled with range slider
	// const minValueRange =
	// 	minMaxSettingsResult[isEmpty(unit) ? '-' : unit]?.minRange < minValue ||
	// 	disableInputsLimits
	// 		? minValue
	// 		: minMaxSettingsResult[isEmpty(unit) ? '-' : unit]?.minRange;

	// const maxValueRange =
	// 	minMaxSettingsResult[isEmpty(unit) ? '-' : unit]?.maxRange > maxValue ||
	// 	disableInputsLimits
	// 		? maxValue
	// 		: minMaxSettingsResult[isEmpty(unit) ? '-' : unit]?.maxRange;

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

	const handleChange = debounce(() => {
		if (onChangeValue) {
			const val =
				latestValueRef.current === '' || optionType === 'string'
					? latestValueRef.current.toString()
					: +latestValueRef.current;
			onChangeValue(val);
		}
	}, 300);

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
		handleChange(result);
	};

	// Temporarily disabled with range slider
	// const rawPreferredValues = [
	// 	latestValueRef.current,
	// 	currentValue,
	// 	value,
	// 	defaultValue,
	// 	initial,
	// 	placeholder,
	// ];

	// Temporarily disabled with range slider
	// const preferredValues = transformRangePreferredValue
	// 	? rawPreferredValues.map(transformRangePreferredValue)
	// 	: rawPreferredValues;

	// Temporarily disabled with range slider
	// const rangeValue = +preferredValues.find(val => /\d/.test(val)) || null;

	const [showHelpContent, setShowHelpContent] = useState(false);

	const handleToggleHelpContent = () => {
		setShowHelpContent(state => !state);
	};

	return (
		<BaseControl
			__nextHasNoMarginBottom
			id={advancedNumberControlId}
			label={label}
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
					<div
						style={{
							position: 'relative',
							display: 'inline-flex',
							alignItems: 'center',
						}}
					>
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
								validateNumberInput(e, customValidationRegex);
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
						<div
							style={{
								position: 'absolute',
								right: '2px',
								top: '50%',
								transform: 'translateY(-50%)',
								display: 'flex',
								flexDirection: 'column',
								gap: '-4px',
							}}
						>
							<button
								type='button'
								onClick={e => {
									e.preventDefault();
									const currentVal =
										parseFloat(latestValueRef.current) || 0;
									const newVal =
										currentVal + (stepValue || 1);
									const maxVal = enableUnit ? maxValue : max;
									if (newVal <= maxVal) {
										latestValueRef.current =
											newVal.toString();
										setCurrentValue(newVal);
										onChangeValue(newVal);
									}
								}}
								onMouseEnter={e => {
									e.target.style.color =
										'var(--maxi-primary-color)';
								}}
								onMouseLeave={e => {
									e.target.style.color = 'var(--maxi-grey)';
								}}
								style={{
									width: '12px',
									height: '10px',
									border: 'none',
									background: 'transparent',
									cursor: 'pointer',
									padding: '0',
									fontSize: '10px',
									color: 'var(--maxi-grey)',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									transition: 'color 0.2s ease',
								}}
							>
								▲
							</button>
							<button
								type='button'
								onClick={e => {
									e.preventDefault();
									const currentVal =
										parseFloat(latestValueRef.current) || 0;
									const newVal =
										currentVal - (stepValue || 1);
									const minVal = enableUnit ? minValue : min;
									if (newVal >= minVal) {
										latestValueRef.current =
											newVal.toString();
										setCurrentValue(newVal);
										onChangeValue(newVal);
									}
								}}
								onMouseEnter={e => {
									e.target.style.color =
										'var(--maxi-primary-color)';
								}}
								onMouseLeave={e => {
									e.target.style.color = 'var(--maxi-grey)';
								}}
								style={{
									width: '12px',
									height: '10px',
									border: 'none',
									background: 'transparent',
									cursor: 'pointer',
									padding: '0',
									fontSize: '10px',
									color: 'var(--maxi-grey)',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									transition: 'color 0.2s ease',
								}}
							>
								▼
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
			{enableAuto && (
				<ToggleSwitch
					label={autoLabel || __('Auto', 'maxi-blocks')}
					className={classNameAutoInput}
					selected={value === 'auto'}
					onChange={val => (val ? onChangeValue('auto') : onReset())}
				/>
			)}
			{!disableReset && (
				<ResetButton
					className={resetButtonClassName}
					onReset={() => {
						setCurrentValue(defaultValue);
						latestValueRef.current = defaultValue;
						onChangeValue(defaultValue);
						onReset();
					}}
					isSmall
				/>
			)}

			{/* Temporarily disabled range slider */}
			{/* {!disableRange && (
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
						const result =
							optionType === 'string'
								? val.toString()
								: +val;
						setCurrentValue(result);
						latestValueRef.current = result;
						onChangeValue(result);
					}}
					min={enableUnit ? minValueRange : min}
					max={maxRange || (enableUnit ? maxValueRange : max)}
					step={stepValue}
					withInputField={false}
					initialPosition={value || initial}
					__nextHasNoMarginBottom
				/>
			)} */}
		</BaseControl>
	);
};

export default AdvancedNumberControl;

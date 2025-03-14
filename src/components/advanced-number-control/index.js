/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { RangeControl } from '@wordpress/components';
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
		allowedUnits = [undefined, 'px', 'em', 'vw', 'vh', '%', '-'],
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
			if (unit === undefined) {
				options.push({ label: 'Default', value: 'default' });
			} else if (unit in minMaxSettings) {
				options.push({ label: unit.toUpperCase(), value: unit });
			}
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

	const rangeValue = +preferredValues.find(val => /\d/.test(val)) || 0;

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
					onChange={val => (val ? onChangeValue('auto') : onReset())}
				/>
			)}
			{value !== 'auto' && (
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
					{enableUnit && (
						<SelectControl
							__nextHasNoMarginBottom
							hideLabelFromVision
							className='maxi-dimensions-control__units'
							options={getOptions()}
							value={unit}
							onChange={val => {
								onChangeUnit(val);

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
							}}
						/>
					)}
					{!disableReset && (
						<ResetButton
							onReset={() => {
								setCurrentValue(defaultValue);
								latestValueRef.current = defaultValue;
								onChangeValue(defaultValue);
								onReset();
							}}
							isSmall
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
							value={rangeValue || placeholder}
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
					)}
				</BaseControl>
			)}
		</>
	);
};

export default AdvancedNumberControl;

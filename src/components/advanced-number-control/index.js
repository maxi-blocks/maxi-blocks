/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { RangeControl } from '@wordpress/components';
import { useInstanceId } from '@wordpress/compose';

/**
 * Internal dependencies
 */
import SelectControl from '../select-control';
import BaseControl from '../base-control';
import Button from '../button';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { trim, isEmpty, isNumber } from 'lodash';

/**
 * Styles
 */
import './editor.scss';
import { reset } from '../../icons';
import { getIsValid } from '../../extensions/styles';

/**
 * Component
 */
const AdvancedNumberControl = props => {
	const {
		label,
		className,
		unit = 'px',
		placeholder = '',
		onChangeUnit,
		enableUnit = false,
		min = 0,
		max = 999,
		initial = 0,
		step = 1,
		defaultValue = '',
		value,
		onChangeValue,
		disableReset = false,
		onReset,
		allowedUnits = ['px', 'em', 'vw', '%', '-'],
		minMaxSettings = {
			px: {
				min: 0,
				max: 3999,
			},
			em: {
				min: 0,
				max: 999,
			},
			vw: {
				min: 0,
				max: 999,
			},
			'%': {
				min: 0,
				max: 100,
			},
			'-': {
				min: 0,
				max: 16,
			},
		},
	} = props;

	const classes = classnames('maxi-advanced-number-control', className);

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

	const minValue = minMaxSettings[isEmpty(unit) ? '-' : unit]?.min;
	const maxValue = minMaxSettings[isEmpty(unit) ? '-' : unit]?.max;

	const getNewValueFromEmpty = e => {
		const {
			nativeEvent: { inputType },
			target: { value: newValue },
		} = e;

		if (isNumber(value)) return newValue;

		const typeofEvent = getIsValid(inputType, true) ? 'type' : 'click';

		switch (typeofEvent) {
			case 'click':
				return (
					(isNumber(placeholder) ? placeholder : 0) +
					(+newValue ? 1 : -1)
				);
			case 'type':
			default:
				return newValue;
		}
	};

	return (
		<BaseControl
			id={advancedNumberControlId}
			label={label}
			className={classes}
		>
			<input
				id={advancedNumberControlId}
				type='number'
				className='maxi-advanced-number-control__value'
				value={value === undefined ? defaultValue : trim(value)}
				onChange={e => {
					let value = getNewValueFromEmpty(e);

					if (enableUnit) {
						if (value !== '' && value > maxValue) value = maxValue;
						if (value !== '' && value < minValue) value = minValue;
					} else {
						if (value !== '' && +value > max) value = max;
						if (value !== '' && +value !== 0 && +value < min)
							value = min;
					}

					onChangeValue(value === '' ? value : +value);
				}}
				min={enableUnit ? minValue : min}
				max={enableUnit ? maxValue : max}
				step={stepValue}
				placeholder={placeholder}
			/>
			{enableUnit && (
				<SelectControl
					label={__('Unit', 'maxi-blocks')}
					hideLabelFromVision
					className='maxi-dimensions-control__units'
					options={getOptions()}
					value={unit}
					onChange={val => {
						onChangeUnit(val);

						if (value > minMaxSettings[val]?.max)
							onChangeValue(minMaxSettings[val]?.max);
					}}
				/>
			)}
			{!disableReset && (
				<Button
					className='components-maxi-control__reset-button'
					onClick={e => {
						e.preventDefault();
						onReset();
					}}
					isSmall
					aria-label={sprintf(
						/* translators: %s: a textual label  */
						__('Reset %s settings', 'maxi-blocks'),
						label.toLowerCase()
					)}
					type='reset'
				>
					{reset}
				</Button>
			)}
			<RangeControl
				label={label}
				value={value || defaultValue || initial || placeholder || 0}
				onChange={val => {
					onChangeValue(+val);
				}}
				min={enableUnit ? minValue : min}
				max={enableUnit ? maxValue : max}
				step={stepValue}
				withInputField={false}
				initialPosition={value || initial}
			/>
		</BaseControl>
	);
};

export default AdvancedNumberControl;

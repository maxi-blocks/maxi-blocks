/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { RangeControl } from '@wordpress/components';

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
import { trim, isEmpty } from 'lodash';

/**
 * Styles
 */
import './editor.scss';
import { reset } from '../../icons';

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

	const getOptions = () => {
		const options = [];

		allowedUnits.includes('px') &&
			options.push({ label: 'PX', value: 'px' });

		allowedUnits.includes('em') &&
			options.push({ label: 'EM', value: 'em' });

		allowedUnits.includes('vw') &&
			options.push({ label: 'VW', value: 'vw' });

		allowedUnits.includes('%') && options.push({ label: '%', value: '%' });

		allowedUnits.includes('-') && options.push({ label: '-', value: '' });

		return options;
	};

	return (
		<BaseControl label={label} className={classes}>
			<input
				type='number'
				className='maxi-advanced-number-control__value'
				value={value === undefined ? defaultValue : trim(value)}
				onChange={e => {
					let { value } = e.target;

					if (enableUnit) {
						if (
							value >
							minMaxSettings[isEmpty(unit) ? '-' : unit].max
						)
							value =
								minMaxSettings[isEmpty(unit) ? '-' : unit].max;
						if (
							value <
							minMaxSettings[isEmpty(unit) ? '-' : unit].min
						)
							value =
								minMaxSettings[isEmpty(unit) ? '-' : unit].min;

						if (value > 100 && unit === '%') value = 100;
					} else {
						if (value !== '' && +value > max) value = max;
						if (value !== '' && +value !== 0 && +value < min)
							value = min;
					}

					onChangeValue(value === '' ? value : +value);
				}}
				min={
					enableUnit
						? minMaxSettings[isEmpty(unit) ? '-' : unit].min
						: min
				}
				max={
					enableUnit
						? minMaxSettings[isEmpty(unit) ? '-' : unit].max
						: max
				}
				step={stepValue}
				placeholder={placeholder}
			/>
			{enableUnit && (
				<SelectControl
					className='maxi-dimensions-control__units'
					options={getOptions()}
					value={unit}
					onChange={val => {
						onChangeUnit(val);

						if (
							value > minMaxSettings[isEmpty(val) ? '-' : val].max
						)
							onChangeValue(
								minMaxSettings[isEmpty(val) ? '-' : val].max
							);
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
				value={value}
				onChange={val => {
					onChangeValue(+val);
				}}
				min={
					enableUnit
						? minMaxSettings[isEmpty(unit) ? '-' : unit].min
						: min
				}
				max={
					enableUnit
						? minMaxSettings[isEmpty(unit) ? '-' : unit].max
						: max
				}
				step={stepValue}
				withInputField={false}
				initialPosition={value || initial}
			/>
		</BaseControl>
	);
};

export default AdvancedNumberControl;

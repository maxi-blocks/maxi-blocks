/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import SelectControl from '../select-control';
import BaseControl from '../base-control';
import Button from '../button';
import RangeSliderControl from '../range-slider-control';

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
const SizeControl = props => {
	const {
		label,
		className,
		unit = 'px',
		placeholder = 'auto',
		onChangeUnit,
		disableUnit = false,
		min = 0,
		max = 999,
		initial = 0,
		step = 1,
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

	const classes = classnames('maxi-size-control', className);

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
			{disableUnit ? (
				<input
					type='number'
					className='maxi-size-control__value'
					value={trim(value)}
					onChange={e => {
						let { value } = e.target;

						if (value !== '' && +value > max) value = max;
						if (value !== '' && +value !== 0 && +value < min)
							value = min;

						onChangeValue(value);
					}}
					min={min}
					max={max}
					step={stepValue}
					placeholder={placeholder}
				/>
			) : (
				<>
					<input
						type='number'
						className='maxi-size-control__value'
						value={trim(value)}
						onChange={e => {
							let value = +e.target.value;

							if (
								value >
								minMaxSettings[isEmpty(unit) ? '-' : unit].max
							)
								value =
									minMaxSettings[isEmpty(unit) ? '-' : unit]
										.max;
							if (
								value <
								minMaxSettings[isEmpty(unit) ? '-' : unit].min
							)
								value =
									minMaxSettings[isEmpty(unit) ? '-' : unit]
										.min;

							if (value > 100 && unit === '%') value = 100;

							onChangeValue(value);
						}}
						min={
							unit
								? minMaxSettings[isEmpty(unit) ? '-' : unit].min
								: null
						}
						max={
							isEmpty(unit)
								? '-'
								: unit
								? minMaxSettings[unit].max
								: null
						}
						step={stepValue}
						placeholder={placeholder}
					/>
					<SelectControl
						className='maxi-dimensions-control__units'
						options={getOptions()}
						value={unit}
						onChange={val => {
							onChangeUnit(val);

							if (value > 100 && val === '%') onChangeValue(100);
						}}
					/>
				</>
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
			{disableUnit ? (
				<RangeSliderControl
					value={+value === '' || +value === 0 ? 0 : +trim(value)}
					onChange={val => onChangeValue(+val)}
					min={min}
					max={max}
					step={stepValue}
					withInputField={false}
					initialPosition={value || initial}
				/>
			) : (
				<RangeSliderControl
					value={+value === '' || +value === 0 ? 0 : +trim(value)}
					onChange={val => onChangeValue(+val)}
					min={minMaxSettings[isEmpty(unit) ? '-' : unit].min}
					max={minMaxSettings[isEmpty(unit) ? '-' : unit].max}
					step={stepValue}
					withInputField={false}
					initialPosition={value || initial}
				/>
			)}
		</BaseControl>
	);
};

export default SizeControl;

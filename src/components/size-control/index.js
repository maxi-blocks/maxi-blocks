/**
 * WordPress dependencies
 */
const { __, sprintf } = wp.i18n;
const { Fragment } = wp.element;
const { RangeControl, SelectControl, BaseControl, Button } = wp.components;

/**
 * External dependencies
 */
import classnames from 'classnames';
import { trim } from 'lodash';

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
		unit,
		onChangeUnit,
		defaultUnit,
		disableUnit = false,
		min = 0,
		max = 999,
		initial = 0,
		step = 1,
		value,
		defaultValue,
		onChangeValue,
		allowedUnits = ['px', 'em', 'vw', '%'],
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
		},
	} = props;

	const classes = classnames('maxi-size-control', className);

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

	const onReset = () => {
		onChangeValue(defaultValue);
		if (!disableUnit) onChangeUnit(defaultUnit);
	};

	return (
		<BaseControl label={label} className={classes}>
			{disableUnit ? (
				<input
					type='number'
					className='maxi-size-control__value'
					value={trim(value)}
					onChange={e => onChangeValue(Number(e.target.value))}
					min={min}
					max={max}
					step={step}
					placeholder='auto'
				/>
			) : (
				<Fragment>
					<input
						type='number'
						className='maxi-size-control__value'
						value={trim(value)}
						onChange={e => onChangeValue(Number(e.target.value))}
						min={unit ? minMaxSettings[unit].min : null}
						max={unit ? minMaxSettings[unit].max : null}
						step={step}
						placeholder='auto'
					/>
					<SelectControl
						className='components-maxi-dimensions-control__units'
						options={getOptions()}
						value={unit}
						onChange={val => onChangeUnit(val)}
					/>
				</Fragment>
			)}
			<Button
				className='components-maxi-control__reset-button'
				onClick={onReset}
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
			{disableUnit ? (
				<RangeControl
					value={
						Number(value) === '' || Number(value) === 0
							? 0
							: Number(trim(value))
					}
					onChange={val => onChangeValue(Number(val))}
					min={min}
					max={max}
					step={step}
					withInputField={false}
					initialPosition={value || initial}
				/>
			) : (
				<RangeControl
					value={
						Number(value) === '' || Number(value) === 0
							? 0
							: Number(trim(value))
					}
					onChange={val => onChangeValue(Number(val))}
					min={unit ? minMaxSettings[unit].min : null}
					max={unit ? minMaxSettings[unit].max : null}
					step={step}
					withInputField={false}
					initialPosition={value || initial}
				/>
			)}
		</BaseControl>
	);
};

export default SizeControl;

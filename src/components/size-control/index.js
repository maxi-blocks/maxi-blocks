/**
 * WordPress dependencies
 */
const { __, sprintf } = wp.i18n;
const { Fragment, useRef } = wp.element;
const { RangeControl, SelectControl, BaseControl, Button } = wp.components;

/**
 * External dependencies
 */
import classnames from 'classnames';
import { trim, isNumber } from 'lodash';

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
				max: 999,
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
				max: 999,
			},
		},
	} = props;

	const rangeRef = useRef(null);

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

		rangeRef.current.setAttribute('value', defaultValue);

		if (!isNumber(defaultValue)) {
			// RangeControl needs a number or to press its own reset button to put the range
			// into beginning again. So we do manually
			const rangeWrapper = rangeRef.current.parentNode;
			const rangeItems = Array.from(rangeWrapper.children);

			rangeItems.forEach(el => {
				el.classList.forEach(elClass => {
					elClass.indexOf('ThumbWrapper') !== -1 &&
						(el.style.left = 0);
				});
			});
		}
	};

	return (
		<BaseControl label={label} className={classes}>
			{disableUnit ? (
				<input
					type='number'
					className='maxi-size-control__value'
					value={trim(value)}
					onChange={e => {
						let result = Number(e.target.value);
						if (result > max) result = max;
						onChangeValue(result);
					}}
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
						onChange={e => {
							let result = Number(e.target.value);
							if (result > minMaxSettings[unit].max)
								result = minMaxSettings[unit].max;
							onChangeValue(result);
						}}
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
					ref={e => (rangeRef.current = e)} // ref={ ref }
					value={value}
					onChange={val => onChangeValue(Number(val))}
					min={min}
					max={max}
					step={step}
					withInputField={false}
					initialPosition={initial}
				/>
			) : (
				<RangeControl
					ref={e => (rangeRef.current = e)} // ref={ ref }
					value={value}
					onChange={val => onChangeValue(Number(val))}
					min={unit ? minMaxSettings[unit].min : null}
					max={unit ? minMaxSettings[unit].max : null}
					step={step}
					withInputField={false}
					initialPosition={initial}
				/>
			)}
		</BaseControl>
	);
};

export default SizeControl;

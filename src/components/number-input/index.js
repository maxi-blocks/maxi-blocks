/**
 * WordPress dependencies
 */
const { useEffect, useState } = wp.element;

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isNil, round } from 'lodash';

/**
 * Styles and icons
 */
import './editor.scss';

/**
 * Component
 */
const NumberInput = props => {
	const {
		className,
		value,
		min = -999,
		max = 10,
		step = 1,
		roundBy = 2,
		placeholder = '',
		ariaLabel,
		allowAuto = false,
		onChange,
	} = props;

	const [counter, setCounter] = useState(value || '');

	useEffect(() => {
		if (isNil(value)) setCounter('');
		if (value === 'auto') setCounter('auto');
	}, [value]);

	const classes = classnames('maxi-number-input', className);

	return (
		<div className={classes}>
			<button
				className='maxi-number-input__spinner maxi-number-input__spinner--up'
				type='button'
				onClick={() => {
					let val =
						counter === 'auto'
							? 0
							: round(+counter + step, roundBy);

					if (val > max) val = max;
					if (val < min) val = min;

					onChange(val);
					setCounter(val);
				}}
			>
				<div className='maxi-number-input__spinner--up__arrow' />
			</button>
			<button
				className='maxi-number-input__spinner maxi-number-input__spinner--down'
				type='button'
				onClick={() => {
					let val =
						counter === 'auto'
							? 0
							: round(+counter - step, roundBy);

					if (val > max) val = max;
					if (val < min) val = min;

					onChange(val);
					setCounter(val);
				}}
			>
				<div className='maxi-number-input__spinner--down__arrow' />
			</button>
			<input
				type='number'
				value={counter}
				placeholder={allowAuto ? 'auto' : placeholder}
				aria-label={ariaLabel}
				onChange={e => {
					if (
						step % 1 === 0
							? /^-?\d*$/.test(e.target.value)
							: /^-?\d*[.,]?\d*$/.test(e.target.value)
					) {
						const { value } = e.target;

						onChange(value);
						setCounter(value);
					}
				}}
			/>
		</div>
	);
};

export default NumberInput;

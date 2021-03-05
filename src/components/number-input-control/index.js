/**
 * WordPress dependencies
 */
const { useState, useEffect } = wp.element;

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
const NumberInputControl = props => {
	const {
		className,
		value,
		min = -999,
		max = 10,
		step = 1,
		onChange,
	} = props;

	const [counter, setCounter] = useState(value || '');

	const classes = classnames('maxi-number-input-control', className);

	useEffect(() => {
		if (isNil(value)) setCounter('');
	});

	return (
		<div className={classes}>
			<button
				onClick={() => {
					let value = round(+counter + step, 2);

					if (value > max) value = max;
					if (value < min) value = min;

					setCounter(value);
					onChange(value);
				}}
			>
				+
			</button>
			<button
				onClick={() => {
					let value = round(+counter - step, 2);

					if (value > max) value = max;
					if (value < min) value = min;

					setCounter(value);
					onChange(value);
				}}
			>
				-
			</button>
			<input
				type='text'
				value={counter}
				onChange={e => {
					if (
						step % 1 === 0
							? /^-?\d*$/.test(e.target.value)
							: /^-?\d*[.,]?\d*$/.test(e.target.value)
					) {
						let value = e.target.value;

						setCounter(value);
						onChange(value);
					}
				}}
			/>
		</div>
	);
};

export default NumberInputControl;

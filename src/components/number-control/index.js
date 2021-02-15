/**
 * WordPress dependencies
 */
const { BaseControl, Button } = wp.components;

/**
 * Internal dependencies
 */
import { reset } from '../../icons';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { trim } from 'lodash';

/**
 * Component
 */
const NumberControl = props => {
	const {
		label,
		className,
		value,
		defaultValue,
		min = -999,
		max = 999,
		onChange,
	} = props;

	const classes = classnames('maxi-number-control', className);

	return (
		<BaseControl label={label} className={classes}>
			<input
				type='number'
				value={value || ''}
				onChange={e => {
					let value = +e.target.value;

					if (value > max) value = max;
					if (value < min) value = min;

					onChange(value);
				}}
				min={min}
				max={max}
			/>
			<Button
				className='components-maxi-control__reset-button'
				onClick={() => onChange(defaultValue)}
				action='reset'
				type='reset'
			>
				{reset}
			</Button>
		</BaseControl>
	);
};

export default NumberControl;

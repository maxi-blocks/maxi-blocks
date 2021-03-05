/**
 * WordPress dependencies
 */
const { BaseControl, Button } = wp.components;

/**
 * Internal dependencies
 */
import { reset } from '../../icons';
import NumberInputControl from '../number-input-control';

/**
 * External dependencies
 */
import classnames from 'classnames';

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
			<NumberInputControl
				value={value}
				min={min}
				max={max}
				onChange={val => onChange(val)}
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

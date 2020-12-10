/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isObject, trim } from 'lodash';

/**
 * Styles
 */
import './editor.scss';

/**
 * Component
 */
const GroupInputControl = props => {
	const {
		className,
		label,
		min = 0,
		max = 998,
		step = 0.1,
		onChange,
	} = props;

	const options = { ...props.options };
	const classes = classnames('maxi-group-input-control', className);

	return (
		<div className={classes}>
			<div className='maxi-group-input-control__input'>
				<input
					type='number'
					min={min}
					max={max}
					step={step}
					value={trim(options[0])}
					onChange={e => {
						options[0] = e.target.value;
						onChange(value);
					}}
				/>
				<label>{__(`Starting ${label}`, 'maxi-blocks')}</label>
			</div>
			<div className='maxi-group-input-control__input'>
				<input
					type='number'
					min={min}
					max={max}
					step={step}
					value={trim(options[1])}
					onChange={e => {
						options[1] = e.target.value;
						onChange(value);
					}}
				/>
				<label>{__(`Mid ${label}`, 'maxi-blocks')}</label>
			</div>
			<div className='maxi-group-input-control__input'>
				<input
					type='number'
					min={min}
					max={max}
					step={step}
					value={trim(options[2])}
					onChange={e => {
						options[2] = e.target.value;
						onChange(value);
					}}
				/>
				<label>{__(`End ${label}`, 'maxi-blocks')}</label>
			</div>
		</div>
	);
};

export default GroupInputControl;

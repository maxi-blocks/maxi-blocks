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
		options,
		onChange,
	} = props;

	const value = !isObject(options) ? JSON.parse(options) : options;

	const classes = classnames('maxi-group-input-control', className);

	return (
		<div className={classes}>
			<div className='maxi-group-input-control__input'>
				<input
					type='number'
					min={min}
					max={max}
					step={step}
					value={trim(value[0])}
					onChange={e => {
						value[0] = e.target.value;
						onChange(JSON.stringify(value));
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
					value={trim(value[1])}
					onChange={e => {
						value[1] = e.target.value;
						onChange(JSON.stringify(value));
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
					value={trim(value[2])}
					onChange={e => {
						value[2] = e.target.value;
						onChange(JSON.stringify(value));
					}}
				/>
				<label>{__(`End ${label}`, 'maxi-blocks')}</label>
			</div>
		</div>
	);
};

export default GroupInputControl;

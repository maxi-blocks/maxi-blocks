/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { useInstanceId } from '@wordpress/compose';

/**
 * Internal dependencies
 */
import BaseControl from '../base-control';

import { Range } from 'react-range';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Component
 */
const MotionUniqueControl = props => {
	const {
		type,
		label,
		className,
		min = -4000,
		max = 4000,
		step = 1,
		values,
		onChange,
		disableReset = false,
		onReset,
	} = props;

	const classes = classnames(
		'maxi-advanced-number-control maxi-motion-unique-control',
		className
	);

	const motionUniqueControlId = `maxi-advanced-number-control__${useInstanceId(
		MotionUniqueControl
	)}`;

	const labels = ['Starting', 'Mid', 'End'];

	return (
		<div className={classes}>
			{values.map((value, key) => {
				return (
					<BaseControl
						// eslint-disable-next-line react/no-array-index-key
						key={key}
						id={motionUniqueControlId}
						label={`${labels[key]} ${label}`}
					>
						<input
							className='maxi-motion-unique-control__content__item__input'
							type='number'
							value={value}
							onChange={val => {
								const newValues = [];
								newValues[key] = val.target.value;
								onChange({ ...values, ...newValues });
							}}
							step={step}
							min={min}
							max={max}
						/>
					</BaseControl>
				);
			})}
		</div>
	);
};

export default MotionUniqueControl;

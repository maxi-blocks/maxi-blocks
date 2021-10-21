/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { useInstanceId } from '@wordpress/compose';

/**
 * Internal dependencies
 */
import BaseControl from '../base-control';
import Button from '../button';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Icons
 */
import { reset } from '../../icons';

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
		defaultValues = [0, 0, 0],
		disableReset = false,
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
						label={__(`${labels[key]} ${label}`, 'maxi-blocks')}
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
						{!disableReset && (
							<Button
								className='components-maxi-control__reset-button'
								onClick={e => {
									e.preventDefault();
									const newValues = [];
									newValues[key] = defaultValues[key];
									onChange({ ...values, ...newValues });
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
					</BaseControl>
				);
			})}
		</div>
	);
};

export default MotionUniqueControl;

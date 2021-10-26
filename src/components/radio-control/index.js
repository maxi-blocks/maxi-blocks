/**
 * Wordpress dependencies
 */
import { useInstanceId } from '@wordpress/compose';

/**
 * Internal dependencies
 */
import BaseControl from '../base-control';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isEmpty } from 'lodash';

/**
 * Styles and Icons
 */
import './editor.scss';

/**
 * Component
 */
const RadioControl = ({
	label,
	className,
	selected,
	help,
	onChange,
	options = [],
	fullWidthMode = false,
	type = 'fancy',
	...props
}) => {
	const instanceId = useInstanceId(RadioControl);
	const id = `inspector-radio-control-${instanceId}`;
	const onChangeValue = event => onChange(event.target.value);

	const classes = classnames(
		'maxi-radio-control',
		type === 'classic-border' &&
			'maxi-classic-radio-control maxi-classic-radio-control__border',
		type === 'fancy' && 'maxi-radio-control__fancy',
		fullWidthMode && 'maxi-radio-control__full-width',
		className
	);

	return (
		!isEmpty(options) && (
			<BaseControl label={label} id={id} help={help} className={classes}>
				{options.map((option, index) => (
					<div
						key={`${id}-${index}`}
						className={`maxi-radio-control__option${
							option.hidden ? ' hidden' : ''
						}`}
					>
						<input
							id={`${id}-${index}`}
							className='maxi-radio-control__input'
							type='radio'
							name={id}
							value={option.value}
							onChange={onChangeValue}
							checked={option.value === selected}
							aria-describedby={help ? `${id}__help` : undefined}
							{...props}
						/>
						<label htmlFor={`${id}-${index}`}>{option.label}</label>
					</div>
				))}
			</BaseControl>
		)
	);
};

export default RadioControl;

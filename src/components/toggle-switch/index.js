/**
 * WordPress dependencies
 */
import { useInstanceId } from '@wordpress/compose';
import { useState } from '@wordpress/element';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import BaseControl from '../base-control';

/**
 * Styles
 */
import './editor.scss';

/**
 * Component
 */
const ToggleSwitch = ({
	className,
	onChange,
	label,
	help,
	selected,
	disabled,
}) => {
	const classes = classnames(
		'maxi-toggle-switch',
		disabled && 'maxi-toggle-switch--disabled', // TODO
		className
	);
	const instanceId = useInstanceId(ToggleSwitch);
	const id = `maxi-toggle-switch-${instanceId}`;
	const [value, setValue] = useState(selected || false);

	return (
		<BaseControl label={label} id={id} help={help} className={classes}>
			<div className='maxi-toggle-switch__toggle'>
				<input
					onChange={() => {
						setValue(!value);
						onChange(!value);
					}}
					checked={value}
					type='checkbox'
					id={id}
				/>
				<label htmlFor={id} />
			</div>
		</BaseControl>
	);
};

export default ToggleSwitch;

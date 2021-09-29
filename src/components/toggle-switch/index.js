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
const ToggleSwitch = ({ className, onChange, label, help, selected }) => {
	const classes = classnames('maxi-toggle-switch', className);
	const instanceId = useInstanceId(ToggleSwitch);
	const id = `maxi-toggle-switch-${instanceId}`;
	const [value, setValue] = useState(selected || false);

	return (
		<div className='maxi-toggle-switch-wrapper' tabIndex='0'>
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
		</div>
	);
};

export default ToggleSwitch;

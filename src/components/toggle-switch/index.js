/**
 * WordPress dependencies
 */
import { useInstanceId } from '@wordpress/compose';

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
	const instanceId = useInstanceId(ToggleSwitch);
	const id = `maxi-toggle-switch-${instanceId}`;
	const classes = classnames('maxi-toggle-switch', className, {
		'maxi-toggle-switch--is-checked': selected,
	});

	return (
		<BaseControl label={label} id={id} help={help} className={classes}>
			<div className='maxi-toggle-switch__toggle'>
				<input
					onChange={() => onChange(!selected)}
					checked={selected}
					type='checkbox'
					id={id}
					aria-describedby={help ? `${id}__help` : undefined}
				/>
				<span className='maxi-toggle-switch__toggle__track' />
				<span className='maxi-toggle-switch__toggle__thumb' />
			</div>
		</BaseControl>
	);
};

export default ToggleSwitch;

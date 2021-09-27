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
const ToggleSwitch = ({
	className,
	selected = false,
	onChange,
	label,
	help,
}) => {
	const classes = classnames('maxi-toggle-switch', className);
	const instanceId = useInstanceId(ToggleSwitch);
	const id = `maxi-toggle-switch-${instanceId}`;

	return (
		<BaseControl
			label={label}
			id={id}
			help={help}
			className={classes}
			onClick={val => onChange(val)}
		>
			<div className='maxi-toggle-switch__toggle'>
				<input
					onChange={val => onChange(val)}
					checked={selected}
					type='checkbox'
					id={id}
				/>
				<label htmlFor={id} />
			</div>
		</BaseControl>
	);
};

export default ToggleSwitch;

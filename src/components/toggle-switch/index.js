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
	onChange,
	label,
	help,
	selected,
	disabled,
}) => {
	const instanceId = useInstanceId(ToggleSwitch);
	const id = `maxi-toggle-switch-${instanceId}`;

	const classes = classnames(
		'maxi-toggle-switch',
		selected && 'maxi-toggle-switch--is-checked',
		disabled && 'maxi-toggle-switch--disabled', // TODO
		className
	);

	return (
		<BaseControl
					__nextHasNoMarginBottom label={label} id={id} help={help} className={classes}>
			<div className='maxi-toggle-switch__toggle'>
				<input
					onChange={() => onChange(!selected)}
					checked={selected || false}
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

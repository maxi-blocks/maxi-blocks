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

// Create a counter for generating unique IDs
let idCounter = 0;
const useUniqueId = (prefix = '') => {
	// Using a ref would be better for React strict mode,
	// but since this is a simple toggle switch, this implementation is sufficient
	idCounter += 1;
	return `${prefix}${idCounter}`;
};

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
	const id = useUniqueId('maxi-toggle-switch-');

	const classes = classnames(
		'maxi-toggle-switch',
		selected && 'maxi-toggle-switch--is-checked',
		disabled && 'maxi-toggle-switch--disabled',
		className
	);

	return (
		<BaseControl
			__nextHasNoMarginBottom
			label={label}
			id={id}
			help={help}
			className={classes}
		>
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

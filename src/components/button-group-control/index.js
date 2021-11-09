/**
 * Wordpress dependencies
 */
import { useInstanceId } from '@wordpress/compose';

/**
 * Internal dependencies
 */
import Button from '../button';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Styles and Icons
 */
import './editor.scss';
import { BaseControl } from '..';

/**
 * Component
 */
const ButtonGroupControl = ({
	label,
	className,
	selected,
	help,
	onChange,
	options = [],
	fullWidthMode = false,
}) => {
	const instanceId = useInstanceId(ButtonGroupControl);
	const id = `inspector-button-group-control-${instanceId}`;

	const classes = classnames(
		'maxi-button-group-control',
		fullWidthMode && 'maxi-button-group-control__full-width',
		className
	);

	return (
		<BaseControl
			label={label}
			help={help}
			className={classes}
			aria-labelledby={label}
			role='group'
		>
			{options.map(({ value, label, ...rest }, index) => (
				<Button
					label={value}
					key={`${id}-${index}`}
					aria-pressed={selected === value}
					className={`maxi-button-group-control__option${
						selected === value
							? ' maxi-button-group-control__option--selected'
							: ''
					}`}
					onClick={() => onChange(value)}
					{...rest}
				>
					{label}
				</Button>
			))}
		</BaseControl>
	);
};

export default ButtonGroupControl;

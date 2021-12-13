/**
 * Wordpress dependencies
 */
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
 * Styles and Icons
 */
import './editor.scss';

/**
 * Component
 */
const ButtonGroupControl = ({
	label = '',
	className,
	selected,
	active,
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
			{options.map(({ value, label, className, ...rest }, index) => (
				<Button
					label={value}
					key={`${id}-${index}`}
					aria-pressed={selected === value}
					className={classnames(
						'maxi-button-group-control__option',
						active?.includes(value) &&
							'maxi-button-group-control__option--active',
						selected === value &&
							'maxi-button-group-control__option--selected',
						className
					)}
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

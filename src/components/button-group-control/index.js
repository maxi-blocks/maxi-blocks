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
import { isEmpty } from 'lodash';

/**
 * Styles and Icons
 */
import './editor.scss';

/**
 * Component
 */
const ButtonGroupControl = ({
	label,
	className,
	selected,
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
		!isEmpty(options) && (
			<div role='group' className={classes} aria-lable={label}>
				{options.map(({ value, label }, index) => (
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
					>
						{label}
					</Button>
				))}
			</div>
		)
	);
};

export default ButtonGroupControl;

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
import { isEmpty } from 'lodash';

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
			<BaseControl label={label} className={classes}>
				{options.map(({ value, label }, index) => (
					<Button
						label={value}
						tabIndex={0}
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
			</BaseControl>
		)
	);
};

export default ButtonGroupControl;

/**
 * Wordpress dependencies
 */
import { useInstanceId } from '@wordpress/compose';

/**
 * Internal dependencies
 */
import BaseControl from '../base-control';

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
const RadioControl = ({
	label,
	className,
	selected,
	help,
	onChange,
	options = [],
	fullWidthMode = false,
}) => {
	const instanceId = useInstanceId(RadioControl);
	const id = `inspector-radio-control-${instanceId}`;

	const classes = classnames(
		'maxi-radio-control',
		fullWidthMode && 'maxi-radio-control__full-width',
		className
	);

	return (
		!isEmpty(options) && (
			<BaseControl label={label} id={id} help={help} className={classes}>
				{options.map(({ value, label }, index) => (
					<button
						role='button'
						tabIndex={0}
						key={`${id}-${index}`}
						className={`maxi-radio-control__option${
							selected === value
								? ' maxi-radio-control__option--selected'
								: ''
						}`}
						onClick={() => onChange(value)}
					>
						{label}
					</button>
				))}
			</BaseControl>
		)
	);
};

export default RadioControl;

/**
 * WordPress dependencies
 */
const { RadioControl } = wp.components;

/**
 * External dependencies
 */
import { isEmpty } from 'lodash';
import classnames from 'classnames';

/**
 * Styles
 */
import './editor.scss';

/**
 * Component
 */
const FancyRadioControl = props => {
	const {
		attr = '',
		className,
		fullWidthMode = false,
		label = '',
		onChange,
		options,
		selected,
		type = 'fancy',
	} = props;

	const classes = classnames(
		type === 'classic' && 'maxi-classic-radio-control',
		type === 'classic-border' &&
			'maxi-classic-radio-control maxi-classic-radio-control__border',
		type === 'fancy' && 'maxi-fancy-radio-control',
		fullWidthMode && 'maxi-fancy-radio-control--full-width',
		className
	);

	return (
		<div className={classes}>
			<RadioControl
				label={label}
				selected={
					typeof options[0].value === 'number' ? +selected : selected
				}
				options={options}
				onChange={val =>
					!isEmpty(attr)
						? onChange({
								[attr]:
									typeof options[0].value === 'number'
										? !!+val
										: val,
						  })
						: onChange(val)
				}
			/>
		</div>
	);
};

export default FancyRadioControl;

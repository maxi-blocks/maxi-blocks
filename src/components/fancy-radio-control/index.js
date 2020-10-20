/**
 * WordPress dependencies
 */
const { RadioControl } = wp.components;

/**
 * External dependencies
 */
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
		className,
		fullWidthMode = false,
		label = '',
		selected,
		options,
		onChange,
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
				selected={selected}
				options={options}
				onChange={onChange}
			/>
		</div>
	);
};

export default FancyRadioControl;

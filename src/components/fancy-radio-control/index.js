/**
 * Internal dependencies
 */
import RadioControl from '../radio-control';

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
		optionType = 'boolean',
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
				onChange={val => {
					switch (optionType) {
						case 'boolean':
							onChange(!!+val);
							break;
						case 'string':
							onChange(val.toString());
							break;
						case 'number':
							onChange(+val);
							break;
						default:
							onChange(val);
							break;
					}
				}}
			/>
		</div>
	);
};

export default FancyRadioControl;

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

/**
 * Internal dependencies
 */
import __experimentalFancyRadioControl from '../fancy-radio-control';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isObject } from 'lodash';

/**
 * Styles
 */
import './editor.scss';

/**
 * Component
 */
const DisplayControl = props => {
	const {
		display,
		className,
		onChange,
		breakpoint,
		defaultDisplay = 'inherit',
	} = props;

	const value = !isObject(display) ? JSON.parse(display) : display;

	const defaultDisplayValue = !isObject(defaultDisplay)
		? JSON.parse(defaultDisplay)
		: defaultDisplay;

	const classes = classnames('maxi-display-control', className);

	return (
		<div className={classes}>
			<__experimentalFancyRadioControl
				label={__('Display block', 'maxi-blocks')}
				selected={
					value[breakpoint].display === 'none'
						? 'none'
						: value[breakpoint].display
				}
				options={[
					{
						label: __('Show', 'maxi-blocks'),
						value: defaultDisplayValue[breakpoint].display,
					},
					{ label: __('Hide', 'maxi-blocks'), value: 'none' },
				]}
				onChange={val => {
					value[breakpoint].display = val;
					onChange(JSON.stringify(value));
				}}
			/>
		</div>
	);
};

export default DisplayControl;

/**
 * WordPress dependencies
 */
const { __, sprintf } = wp.i18n;
const { ColorPicker, BaseControl, Button } = wp.components;

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Styles and icons
 */
import './editor.scss';
import { reset } from '../../icons';

/**
 * Component
 */
const ColorControl = props => {
	const { label, className, color, defaultColor = '', onChange } = props;

	const classes = classnames('maxi-color-control', className);

	const returnColor = val => {
		return `rgba(${val.rgb.r},${val.rgb.g},${val.rgb.b},${val.rgb.a})`;
	};

	const onReset = () => onChange(defaultColor);

	return (
		<div className={classes}>
			<BaseControl
				className='maxi-color-control__display'
				label={`${label} ${__('Colour', 'maxi-blocks')}`}
			>
				<div className='maxi-color-control__display__color'>
					<span
						style={{
							background: color,
						}}
					/>
					<Button
						className='components-maxi-control__reset-button'
						onClick={() => onReset()}
						aria-label={sprintf(
							/* translators: %s: a textual label  */
							__('Reset %s settings', 'maxi-blocks'),
							'font size'
						)}
						type='reset'
					>
						{reset}
					</Button>
				</div>
			</BaseControl>
			<div className='maxi-color-control__color'>
				<ColorPicker
					color={color}
					onChangeComplete={val => onChange(returnColor(val))}
				/>
			</div>
		</div>
	);
};

export default ColorControl;

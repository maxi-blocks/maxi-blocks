/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import BaseControl from '../base-control';
import OpacityControl from '../opacity-control';

/**
 * External dependencies
 */
import ChromePicker from 'react-color';
import tinycolor from 'tinycolor2';
import { isEmpty } from 'lodash';

/**
 * Component
 */
const CustomColorControl = props => {
	const {
		label,
		color,
		onChangeValue,
		disableColorDisplay,
		disableOpacity,
		onReset,
	} = props;

	return (
		<>
			{!disableColorDisplay && (
				<BaseControl
					className='maxi-color-control__display'
					label={`${label} ${__('colour', 'maxi-blocks')}`}
				>
					<div className='maxi-color-control__display__color'>
						<span
							style={{
								background: tinycolor(color).toRgbString(),
							}}
						/>
					</div>
				</BaseControl>
			)}
			{!disableOpacity && (
				<OpacityControl
					label={__('Colour opacity', 'maxi-blocks')}
					opacity={color.a}
					onChange={val => {
						if (!isEmpty(color)) {
							color.a = val;

							onChangeValue({
								color: tinycolor(color).toRgbString(),
								paletteOpacity: val,
							});
						}
					}}
					onReset={onReset}
				/>
			)}
			<div className='maxi-color-control__color'>
				<ChromePicker
					color={color}
					onChangeComplete={val => {
						onChangeValue({
							color: tinycolor(val.rgb)
								.toRgbString()
								.replace(/\s/g, ''),
						});
					}}
					disableAlpha
				/>
			</div>
		</>
	);
};

export default CustomColorControl;

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import AdvancedNumberControl from '../advanced-number-control';
import BaseControl from '../base-control';

/**
 * External dependencies
 */
import ChromePicker from 'react-color';
import tinycolor from 'tinycolor2';
import { isEmpty, isNil } from 'lodash';

/**
 * Component
 */
const CustomColorControl = props => {
	const {
		label,
		color,
		onChangeValue,
		onReset,
		disableColorDisplay,
		disableOpacity,
	} = props;

	return (
		<>
			{!disableColorDisplay && (
				<BaseControl
					className='maxi-color-control__display'
					label={`${label} ${__('Colour', 'maxi-blocks')}`}
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
				<AdvancedNumberControl
					label={__('Colour Opacity', 'maxi-blocks')}
					value={color.a * 100}
					onChangeValue={val => {
						const value = !isNil(val) ? +val : 0;

						if (!isEmpty(color)) {
							color.a = value / 100;

							onChangeValue({
								color: tinycolor(color).toRgbString(),
								paletteOpacity: value,
							});
						}
					}}
					min={0}
					max={100}
					initialPosition={100}
					onReset={() => onReset()}
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
